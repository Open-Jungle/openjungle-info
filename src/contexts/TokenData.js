import React, { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react';

import { useEthPrice } from './GlobalData';

import { uniswapClient } from '../apollo/client'
import { TOKEN_DATA, TOKEN_TOP_DAY_DATAS, PAIR_DATA, TOKENS_HISTORICAL_BULK } from '../apollo/queries'

import { getBlockFromTimestamp, get2DayPercentChange, getPercentChange } from '../utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// reducer keys
const UPDATE_TOP_TOKENS = 'UPDATE_TOP_TOKENS'

const TokenDataContext = createContext();
export function useTokenDataContext() {
    return useContext(TokenDataContext)
}

function reducer(state, { type, payload }) {
    switch (type) {
        
        case UPDATE_TOP_TOKENS: {
            const { topTokens } = payload
            let added = {}
            topTokens && topTokens.map((token) => { return (added[token.id] = token) })
            return {
                ...state,
                ...added,
            }
        }

        default: {
            throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
        }
    }
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, {})

    const updateTopTokens = useCallback((topTokens) => {
        dispatch({
            type: UPDATE_TOP_TOKENS,
            payload: { topTokens },
        })
    }, [])

    return (
        <TokenDataContext.Provider 
            value={ useMemo(
                () => [
                    state,
                    { updateTopTokens },
                ],[state, updateTopTokens]
            )}
        >
            {children}
        </TokenDataContext.Provider>
    )
}

export function Updater() {
    const [, { updateTopTokens }] = useTokenDataContext()
    const [ethPrice, ethPriceOld] = useEthPrice()
    useEffect(() => {
        async function getData() {
            // get top pairs for overview list
            let topTokens = await getTopTokens(ethPrice, ethPriceOld)
            topTokens && updateTopTokens(topTokens)
        }
        ethPrice && ethPriceOld && getData()
    }, [ethPrice, ethPriceOld, updateTopTokens])
    return null
}

const getTopTokens = async (ethPrice, ethPriceOld) => {
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()
    let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
    let twoDayBlock = await getBlockFromTimestamp(utcTwoDaysBack)

    try {
        // need to get the top tokens by liquidity by need token day datas
        const currentDate = parseInt(Date.now() / 86400 / 1000) * 86400 - 86400

        let tokenids = await uniswapClient.query({
            query: TOKEN_TOP_DAY_DATAS,
            fetchPolicy: 'network-only',
            variables: { date: currentDate },
        })

        const ids = tokenids?.data?.tokenDayDatas?.reduce((accum, entry) => {
            accum.push(entry.id.slice(0, 42))
            return accum
        }, [])

        let current = await uniswapClient.query({
            query: TOKENS_HISTORICAL_BULK(ids),
            fetchPolicy: 'cache-first',
        })

        let oneDayResult = await uniswapClient.query({
            query: TOKENS_HISTORICAL_BULK(ids, oneDayBlock),
            fetchPolicy: 'cache-first',
        })

        let twoDayResult = await uniswapClient.query({
            query: TOKENS_HISTORICAL_BULK(ids, twoDayBlock),
            fetchPolicy: 'cache-first',
        })

        let oneDayData = oneDayResult?.data?.tokens.reduce((obj, cur, i) => {
            return { ...obj, [cur.id]: cur }
        }, {})

        let twoDayData = twoDayResult?.data?.tokens.reduce((obj, cur, i) => {
            return { ...obj, [cur.id]: cur }
        }, {})

        let bulkResults = await Promise.all( current && oneDayData && twoDayData && current?.data?.tokens.map(async (token) => {
            let data = token

            // let liquidityDataThisToken = liquidityData?.[token.id]
            let oneDayHistory = oneDayData?.[token.id]
            let twoDayHistory = twoDayData?.[token.id]

            // catch the case where token wasnt in top list in previous days
            if (!oneDayHistory) {
                let oneDayResult = await uniswapClient.query({
                    query: TOKEN_DATA(token.id, oneDayBlock),
                    fetchPolicy: 'cache-first',
                })
                oneDayHistory = oneDayResult.data.tokens[0]
            }
            
            if (!twoDayHistory) {
                let twoDayResult = await uniswapClient.query({
                    query: TOKEN_DATA(token.id, twoDayBlock),
                    fetchPolicy: 'cache-first',
                })
                twoDayHistory = twoDayResult.data.tokens[0]
            }

            // calculate percentage changes and daily changes
            const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
                data.tradeVolumeUSD,
                oneDayHistory?.tradeVolumeUSD ?? 0,
                twoDayHistory?.tradeVolumeUSD ?? 0
            )
            const [oneDayTxns, txnChange] = get2DayPercentChange(
                data.txCount,
                oneDayHistory?.txCount ?? 0,
                twoDayHistory?.txCount ?? 0
            )

            const currentLiquidityUSD = data?.totalLiquidity * ethPrice * data?.derivedETH
            const oldLiquidityUSD = oneDayHistory?.totalLiquidity * ethPriceOld * oneDayHistory?.derivedETH

            // percent changes
            const priceChangeUSD = getPercentChange(
                data?.derivedETH * ethPrice,
                oneDayHistory?.derivedETH ? oneDayHistory?.derivedETH * ethPriceOld : 0
            )

            // set data
            data.priceUSD = data?.derivedETH * ethPrice
            data.totalLiquidityUSD = currentLiquidityUSD
            data.oneDayVolumeUSD = parseFloat(oneDayVolumeUSD)
            data.volumeChangeUSD = volumeChangeUSD
            data.priceChangeUSD = priceChangeUSD
            data.liquidityChangeUSD = getPercentChange(currentLiquidityUSD ?? 0, oldLiquidityUSD ?? 0)
            data.oneDayTxns = oneDayTxns
            data.txnChange = txnChange

            // new tokens
            if (!oneDayHistory && data) {
                data.oneDayVolumeUSD = data.tradeVolumeUSD
                data.oneDayVolumeETH = data.tradeVolume * data.derivedETH
                data.oneDayTxns = data.txCount
            }

            // HOTFIX for Aave
            if (data.id === '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
                const aaveData = await uniswapClient.query({
                    query: PAIR_DATA('0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f'),
                    fetchPolicy: 'cache-first',
                })
                const result = aaveData.data.pairs[0]
                data.totalLiquidityUSD = parseFloat(result.reserveUSD) / 2
                data.liquidityChangeUSD = 0
                data.priceChangeUSD = 0
            }

            // used for custom adjustments
            data.oneDayData = oneDayHistory
            data.twoDayData = twoDayHistory

            return data
        }))

        return bulkResults

        // calculate percentage changes and daily changes
    } catch (e) { console.log(e) }
}

export function useAllTokenData() {
    const [state] = useTokenDataContext()

    // filter out for only addresses
    return Object.keys(state)
        .filter((key) => key !== 'combinedVol')
        .reduce((res, key) => {
            res[key] = state[key]
            return res
        }, {})
}
