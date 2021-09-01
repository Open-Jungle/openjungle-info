import React, { createContext, useContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'

// contexts
import { useTimeframe } from './Application'

// utils
import { getTimeframe, getPercentChange, getBlockFromTimestamp } from '../utils'

// clients and queries
import { uniswapClient, pancakeswapClient } from '../apollo/client'
import { ETH_PRICE, UNISWAP_GLOBAL_CHART, PANCAKESWAP_GLOBAL_CHART } from '../apollo/queries'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

// context state keys
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'
const GLOBAL_DATA_UNISWAP = 'GLOBAL_DATA_UNISWAP'
const GLOBAL_CHART_DATA_UNISWAP = 'GLOBAL_CHART_DATA_UNISWAP'
const GLOBAL_CHART_DATA_PANCAKESWAP = 'GLOBAL_CHART_DATA_PANCAKESWAP'

// reducer keys
const UPDATE_GLOBAL_DATA_UNISWAP = 'UPDATE_GLOBAL_DATA_UNISWAP'
const UPDATE_GLOBAL_CHART_DATA_UNISWAP = 'UPDATE_GLOBAL_CHART_DATA_UNISWAP'
const UPDATE_GLOBAL_CHART_DATA_PANCAKESWAP = 'UPDATE_GLOBAL_CHART_DATA_PANCAKESWAP'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'

// initialize the context
const GlobalDataContext = createContext();
function useGlobalDataContext() { return useContext(GlobalDataContext) }

function reducer(state, { type, payload }) {
    switch(type){

        case UPDATE_ETH_PRICE: {
            const { ethPrice, oneDayPrice, ethPriceChange } = payload
            return {
                [ETH_PRICE_KEY]: ethPrice, oneDayPrice, ethPriceChange
            }
        }

        case UPDATE_GLOBAL_DATA_UNISWAP: {
            const { data } = payload
            return {
                ...state,
                [GLOBAL_DATA_UNISWAP]: data,
            }
        }

        case UPDATE_GLOBAL_CHART_DATA_UNISWAP: {
            const { daily, weekly } = payload
            return {
                ...state,
                [GLOBAL_CHART_DATA_UNISWAP]: { daily, weekly },
            }
        }

        case UPDATE_GLOBAL_CHART_DATA_PANCAKESWAP: {
            const { daily, weekly } = payload
            return {
                ...state,
                [GLOBAL_CHART_DATA_PANCAKESWAP]: { daily, weekly },
            }
        }

        default: {
            throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
        }
    }
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, {})

    const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
        dispatch({
            type: UPDATE_ETH_PRICE,
            payload: { ethPrice, oneDayPrice, ethPriceChange },
        })
    }, [])

    const updateGlobalDataUniswap = useCallback((data)=>{
        dispatch({
            type: UPDATE_GLOBAL_DATA_UNISWAP,
            payload: { data }
        })
    },[])

    const updateGlobalChartDataUniswap = useCallback((daily, weekly)=>{
        dispatch({
            type: UPDATE_GLOBAL_CHART_DATA_UNISWAP,
            payload: { daily, weekly }
        })
    },[])

    const updateGlobalChartDataPancakeswap = useCallback((daily, weekly)=>{
        dispatch({
            type: UPDATE_GLOBAL_CHART_DATA_PANCAKESWAP,
            payload: { daily, weekly }
        })
    },[])

    return(
        <GlobalDataContext.Provider 
            value={ useMemo(
                () => [
                    state,
                    {
                        updateEthPrice,
                        updateGlobalDataUniswap,
                        updateGlobalChartDataUniswap,
                        updateGlobalChartDataPancakeswap
                    }
                ],[state, updateEthPrice, updateGlobalDataUniswap, updateGlobalChartDataUniswap, updateGlobalChartDataPancakeswap]
            )}
        >
            {children}
        </GlobalDataContext.Provider>
    )
}

let checked = false
const getGlobalChartData = async (dex, oldestDateToFetch) => {
    let data = []
    let weeklyData = []
    const utcEndTime = dayjs.utc()
    let skip = 0
    let allFound = false

    try {
        if(dex === 'uniswap') {
            while (!allFound) {
                let result = await uniswapClient.query({
                    query: UNISWAP_GLOBAL_CHART,
                    variables: { startTime: oldestDateToFetch, skip },
                    fetchPolicy: 'cache-first',
                })
                skip += 1000
                data = data.concat(result.data.uniswapDayDatas)
                if (result.data.uniswapDayDatas.length < 1000) { allFound = true }
            }
        } else {
            while (!allFound) {
                let result = await pancakeswapClient.query({
                    query: PANCAKESWAP_GLOBAL_CHART,
                    variables: { startTime: oldestDateToFetch, skip },
                    fetchPolicy: 'cache-first',
                })
                skip += 1000
                data = data.concat(result.data.pancakeDayDatas)
                if (result.data.pancakeDayDatas.length < 1000) { allFound = true }
            }
        }
        

        if (data) {
            let dayIndexSet = new Set()
            let dayIndexArray = []
            const oneDay = 24 * 60 * 60

            // for each day, parse the daily volume and format for chart array
            data.forEach((dayData, i) => {
                // add the day index to the set of days
                dayIndexSet.add((data[i].date / oneDay).toFixed(0))
                dayIndexArray.push(data[i])
                dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
            })

            // fill in empty days ( there will be no day datas if no trades made that day )
            let timestamp = data[0].date ? data[0].date : oldestDateToFetch
            let latestLiquidityUSD = data[0].totalLiquidityUSD
            let latestDayDats = data[0].mostLiquidTokens
            let index = 1
            while (timestamp < utcEndTime.unix() - oneDay) {
                const nextDay = timestamp + oneDay
                let currentDayIndex = (nextDay / oneDay).toFixed(0)

                if (!dayIndexSet.has(currentDayIndex)) {
                    data.push({
                        date: nextDay,
                        dailyVolumeUSD: 0,
                        totalLiquidityUSD: latestLiquidityUSD,
                        mostLiquidTokens: latestDayDats,
                    })
                } else {
                    latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
                    latestDayDats = dayIndexArray[index].mostLiquidTokens
                    index = index + 1
                }
                timestamp = nextDay
            }
        }

        // format weekly data for weekly sized chunks
        data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
        let startIndexWeekly = -1
        let currentWeek = -1

        data.forEach((entry, i) => {   
            const week = dayjs.utc(dayjs.unix(data[i].date)).week()
            if (week !== currentWeek) {
                currentWeek = week;
                startIndexWeekly++;
            }
            weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {}
            weeklyData[startIndexWeekly].date = data[i].date
            weeklyData[startIndexWeekly].weeklyVolumeUSD = (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) + data[i].dailyVolumeUSD
        })

        if (!checked) {
            checked = true
        }
    } catch (e) { console.log(e) }
    return [data, weeklyData]
}

// Gets the current price of ETH, 24 hour price, and % change between them
const getEthPrice = async () => {
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()

    let ethPrice = 0
    let ethPriceOneDay = 0
    let priceChangeETH = 0

    try {
        
        // get the actual price of ETH
        let result = await uniswapClient.query({
            query: ETH_PRICE(),
            fetchPolicy: 'cache-first',
        })
        
        // get one day back price of ETH for % change
        let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
        let resultOneDay = await uniswapClient.query({
            query: ETH_PRICE(oneDayBlock),
            fetchPolicy: 'cache-first',
        })

        const currentPrice = result?.data?.bundles[0]?.ethPrice
        const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice
        priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice)
        ethPrice = currentPrice
        ethPriceOneDay = oneDayBackPrice
    } catch (e) { console.log(e) }

    return [ethPrice, ethPriceOneDay, priceChangeETH]
}

export function useEthPrice() {
    const [state, { updateEthPrice }] = useGlobalDataContext()
    const ethPrice = state?.[ETH_PRICE_KEY]
    const ethPriceOld = state?.['oneDayPrice']
    useEffect(() => {
        async function checkForEthPrice() {
            if (!ethPrice) {
                let [newPrice, oneDayPrice, priceChange] = await getEthPrice()
                updateEthPrice(newPrice, oneDayPrice, priceChange)
            }
        }
        checkForEthPrice()
    }, [ethPrice, updateEthPrice])
    return [ethPrice, ethPriceOld]
}

export function useGlobalChartDataUniswap() {
    const [state, { updateGlobalChartDataUniswap }] = useGlobalDataContext();
    const [oldestDateFetch, setOldestDateFetched] = useState();
    const [activeWindow] = useTimeframe();

    const chartDataDailyUniswap = state?.GLOBAL_CHART_DATA_UNISWAP?.daily;
    const chartDataWeeklyUniswap = state?.GLOBAL_CHART_DATA_UNISWAP?.weekly;

    /**
    * Keep track of oldest date fetched. Used to
    * limit data fetched until its actually needed.
    * (dont fetch year long stuff unless year option selected)
    */
    useEffect(() => {
        // based on window, get starttime
        let startTime = getTimeframe(activeWindow)

        if ((activeWindow && startTime < oldestDateFetch) || !oldestDateFetch) {
            setOldestDateFetched(startTime)
        }
    }, [activeWindow, oldestDateFetch])

    /**
    * Fetch uniswapdata if none fetched or older data is needed
    */
    useEffect(() => {
        async function fetchData() {
            // historical stuff for chart
            let [newChartData, newWeeklyData] = await getGlobalChartData('uniswap', oldestDateFetch, undefined)
            updateGlobalChartDataUniswap(newChartData, newWeeklyData)
        }
        if (oldestDateFetch && !(chartDataDailyUniswap && chartDataWeeklyUniswap)) {
            fetchData()
        }
    }, [chartDataDailyUniswap, chartDataWeeklyUniswap, oldestDateFetch, updateGlobalChartDataUniswap])

    return [chartDataDailyUniswap, chartDataWeeklyUniswap]
}

export function useGlobalChartDataPancakeswap() {
    const [state, { updateGlobalChartDataPancakeswap }] = useGlobalDataContext();
    const [oldestDateFetch, setOldestDateFetched] = useState();
    const [activeWindow] = useTimeframe();

    const chartDataDailyPancakeswap = state?.GLOBAL_CHART_DATA_PANCAKESWAP?.daily;
    const chartDataWeeklyPancakeswap = state?.GLOBAL_CHART_DATA_PANCAKESWAP?.weekly;

    /**
    * Keep track of oldest date fetched. Used to
    * limit data fetched until its actually needed.
    * (dont fetch year long stuff unless year option selected)
    */
    useEffect(() => {
        // based on window, get starttime
        let startTime = getTimeframe(activeWindow)

        if ((activeWindow && startTime < oldestDateFetch) || !oldestDateFetch) {
            setOldestDateFetched(startTime)
        }
    }, [activeWindow, oldestDateFetch])

    /**
    * Fetch uniswapdata if none fetched or older data is needed
    */
    useEffect(() => {
        async function fetchData() {
            // historical stuff for chart
            let [newChartData, newWeeklyData] = await getGlobalChartData('pancakeswap', oldestDateFetch, undefined)
            updateGlobalChartDataPancakeswap(newChartData, newWeeklyData)
        }
        if (oldestDateFetch && !(chartDataDailyPancakeswap && chartDataWeeklyPancakeswap)) {
            fetchData()
        }
    }, [chartDataDailyPancakeswap, chartDataWeeklyPancakeswap, oldestDateFetch, updateGlobalChartDataPancakeswap])

    return [chartDataDailyPancakeswap, chartDataWeeklyPancakeswap]
}

export function useBattleBarData() {
    useGlobalChartDataUniswap();
    useGlobalChartDataPancakeswap();
    const [state] = useGlobalDataContext();
    const chartDataDailyPancakeswap = state?.GLOBAL_CHART_DATA_PANCAKESWAP?.daily;
    const chartDataDailyUniswap = state?.GLOBAL_CHART_DATA_UNISWAP?.daily;
    return [chartDataDailyUniswap, chartDataDailyPancakeswap]
}
