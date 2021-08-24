import gql from 'graphql-tag'

export const UNISWAP_GLOBAL_CHART = gql`
    query uniswapDayDatas($startTime: Int!, $skip: Int!) {
        uniswapDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
            id
            date
            totalVolumeUSD
            dailyVolumeUSD
            dailyVolumeETH
            totalLiquidityUSD
            totalLiquidityETH
        }
    }
`;

export const PANCAKESWAP_GLOBAL_CHART = gql`
    query pancakeDayDatas($startTime: Int!, $skip: Int!) {
        pancakeDayDatas(first: 1000, skip: $skip, where: {date_gt: $startTime}, orderBy: date, orderDirection: asc) {
            date
            dailyVolumeUSD
            totalLiquidityUSD
            __typename
        }
    }
`;
