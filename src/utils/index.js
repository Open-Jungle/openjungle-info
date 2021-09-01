import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Numeral from 'numeral'
import { Text } from 'rebass'
import { ethers } from 'ethers'

import { EthBlockClient } from '../apollo/client'
import { ETH_GET_BLOCK } from '../apollo/queries'

import { timeframeOptions } from '../constants'

dayjs.extend(utc)

// is used to select a timeframe on charts, the time windows should be a value of timeframeOptions from constants
export function getTimeframe(timeWindow) {
    const utcEndTime = dayjs.utc()
    // based on window, get starttime
    let utcStartTime
    switch (timeWindow) {
        case timeframeOptions.WEEK:
            utcStartTime = utcEndTime.subtract(1, 'week').endOf('day').unix() - 1
        break
        case timeframeOptions.MONTH:
            utcStartTime = utcEndTime.subtract(1, 'month').endOf('day').unix() - 1
        break
        case timeframeOptions.ALL_TIME:
            utcStartTime = utcEndTime.subtract(1, 'year').endOf('day').unix() - 1
        break
        default:
            utcStartTime = utcEndTime.subtract(1, 'year').startOf('year').unix() - 1
        break
    }
    return utcStartTime
}

const toK = (num) => { return Numeral(num).format('0.[00]a') }

const formatDollarAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(num)
}

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
    if (isNaN(number) || number === '' || number === undefined) { return usd ? '' : 0 }
    let num = parseFloat(number)

    if (num > 500000000) { return (usd ? '$' : '') + toK(num.toFixed(0), true) }

    if (num === 0) {
        if (usd) { return '$0' }
        return 0
    }

    if (num < 0.0001 && num > 0) { return usd ? '< $0.0001' : '< 0.0001' }

    if (num > 1000) {
        return usd ? formatDollarAmount(num, 0) : Number(parseFloat(num).toFixed(0)).toLocaleString()
    }

    if (usd) {
        if (num < 0.1) { return formatDollarAmount(num, 4) } 
        else { return formatDollarAmount(num, 2) }
    }

    return Number(parseFloat(num).toFixed(4)).toString()
}

export async function getBlockFromTimestamp(timestamp) {
    let result = await EthBlockClient.query({
        query: ETH_GET_BLOCK,
        variables: {
            timestampFrom: timestamp,
            timestampTo: timestamp + 600,
        },
        fetchPolicy: 'cache-first',
    })
    return result?.data?.blocks?.[0]?.number
}

export const getPercentChange = (valueNow, value24HoursAgo) => {
    const adjustedPercentChange = ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100
    if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) { return 0 }
    return adjustedPercentChange
}

export const get2DayPercentChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  // get volume info for both 24 hour periods
  let currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo)
  let previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo)

  const adjustedPercentChange = (parseFloat(currentChange - previousChange) / parseFloat(previousChange)) * 100

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0]
  }
  return [currentChange, adjustedPercentChange]
}

export function formattedPercent(percent) {
    percent = parseFloat(percent)
    if (!percent || percent === 0) { return <Text fontWeight={500}>0%</Text> }
    if (percent < 0.0001 && percent > 0) { return (<Text fontWeight={500} color="green">{'< 0.0001%'}</Text>)}
    if (percent < 0 && percent > -0.0001) { return ( <Text fontWeight={500} color="red">{'< 0.0001%'}</Text>)}

    let fixedPercent = percent.toFixed(2)
    if (fixedPercent === '0.00') { return '0%' }
    if (fixedPercent > 0) {
        if (fixedPercent > 100) { return <Text fontWeight={500} color="green">{`+${percent?.toFixed(0).toLocaleString()}%`}</Text> } 
        else { return <Text fontWeight={500} color="green">{`+${fixedPercent}%`}</Text> }
    } 
    else { return <Text fontWeight={500} color="red">{`${fixedPercent}%`}</Text> }
}

export const isAddress = (value) => {
    try { return ethers.utils.getAddress(value.toLowerCase()) } 
    catch { return false }
}