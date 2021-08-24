import React, { createContext, useContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'

// contexts
import { useTimeframe } from './Application'

// utils
import { getTimeframe } from '../utils'

// clients and queries
import { uniswapClient } from '../apollo/client'
import { GLOBAL_CHART } from '../apollo/queries'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

// reducer keys
const UPDATE_GLOBAL_CHART_DATA_UNISWAP = 'UPDATE_GLOBAL_CHART_DATA_UNISWAP'

// initialize the context
const GlobalDataContext = createContext();
function useGlobalDataContext() { return useContext(GlobalDataContext) }

function reducer(state, { type, payload }) {
    switch(type){

        case UPDATE_GLOBAL_CHART_DATA_UNISWAP: {
            const { daily, weekly } = payload
            return {
                ...state,
                GLOBAL_CHART_DATA_UNISWAP: { daily, weekly },
            }
        }

        default: {
            throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
        }
    }
}

export default function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, {})

    const updateGlobalChartDataUniswap = useCallback((daily, weekly)=>{
        dispatch({
            type: UPDATE_GLOBAL_CHART_DATA_UNISWAP,
            payload: { daily, weekly }
        })
    },[])

    return(
        <GlobalDataContext.Provider 
            value={ useMemo(
                () => [
                    state,
                    {
                        updateGlobalChartDataUniswap,
                    }
                ],[state, updateGlobalChartDataUniswap]
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

    let client = dex === 'uniswap' ? uniswapClient : uniswapClient

    try {
        while (!allFound) {
            let result = await client.query({
                query: GLOBAL_CHART,
                variables: { startTime: oldestDateToFetch, skip },
                fetchPolicy: 'cache-first',
            })
            skip += 1000
            data = data.concat(result.data.uniswapDayDatas)
            if (result.data.uniswapDayDatas.length < 1000) { allFound = true }
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

export function useGlobalChartData() {
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
    * Fetch data if none fetched or older data is needed
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

