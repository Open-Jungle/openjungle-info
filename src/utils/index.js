import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Numeral from 'numeral'

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
    if (isNaN(number) || number === '' || number === undefined) { return usd ? '$0' : 0 }
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
