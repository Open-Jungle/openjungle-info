import gql from 'graphql-tag'

const PairFields = `
    fragment PairFields on Pair {
        id
        txCount
        token0 {
            id
            symbol
            name
            totalLiquidity
            derivedETH
        }
        token1 {
            id
            symbol
            name
            totalLiquidity
            derivedETH
        }
        reserve0
        reserve1
        reserveUSD
        totalSupply
        trackedReserveETH
        reserveETH
        volumeUSD
        untrackedVolumeUSD
        token0Price
        token1Price
        createdAtTimestamp
    }
`;

const TokenFields = `
    fragment TokenFields on Token {
        id
        name
        symbol
        derivedETH
        tradeVolume
        tradeVolumeUSD
        untrackedVolumeUSD
        totalLiquidity
        txCount
    }
`;

export const ETH_PRICE = (block) => {
    const queryString = (
        block ? 
            `query bundles {
                bundles(
                    where: { id: 1 } 
                    block: { number: ${block} }
                ) {id, ethPrice}
            }` 
        : 
            `query bundles {
                bundles(
                    where: { id: 1 }
                ) {id, ethPrice}
            }`
    )
    return gql(queryString)
}

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

export const ETH_GET_BLOCK = gql`
    query blocks($timestampFrom: Int!, $timestampTo: Int!) {
        blocks(
            first: 1
            orderBy: timestamp
            orderDirection: asc
            where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
        ) {id, number, timestamp}
    }
`;

export const TOKEN_DATA = (tokenAddress, block) => { 
    const queryString = `
        ${TokenFields}
        query tokens {
            tokens(${block ? `block : {number: ${block}}` : ``} where: {id:"${tokenAddress}"}) { ...TokenFields }
            pairs0: pairs(where: {token0: "${tokenAddress}"}, first: 50, orderBy: reserveUSD, orderDirection: desc){ id }
            pairs1: pairs(where: {token1: "${tokenAddress}"}, first: 50, orderBy: reserveUSD, orderDirection: desc){ id }
        }
    `;
    
    return gql(queryString)
}

export const PAIR_DATA = (pairAddress, block) => { 
    const queryString = `
        ${PairFields}
        query pairs {
            pairs(${block ? `block: {number: ${block}}` : ``} where: { id: "${pairAddress}"} ) { ...PairFields }
        }
    `;

    return gql(queryString)
}

export const TOKENS_HISTORICAL_BULK = (tokens, block) => {
    let tokenString = `[`
    tokens.map((token) => { return (tokenString += `"${token}",`) })
    tokenString += ']'
    let queryString = `
        query tokens {
            tokens(first: 50, where: {id_in: ${tokenString}}, ${block ? 'block: {number: ' + block + '}' : ''}  ) {
                id
                name
                symbol
                derivedETH
                tradeVolume
                tradeVolumeUSD
                untrackedVolumeUSD
                totalLiquidity
                txCount
            }
        }
    `;
    
    return gql(queryString)
}

export const TOKEN_TOP_DAY_DATAS = gql`
    query tokenDayDatas($date: Int) {
        tokenDayDatas(first: 50, orderBy: totalLiquidityUSD, orderDirection: desc, where: { date_gt: $date }) {
            id
            date
        }
    }
`;
