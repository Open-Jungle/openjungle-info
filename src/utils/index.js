import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { timeframeOptions } from '../constants'

dayjs.extend(utc)
 
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