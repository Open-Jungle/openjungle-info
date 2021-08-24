import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const uniswapClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2' }),
    cache: new InMemoryCache(),
    shouldBatch: true,
})

export const pancakeswapClient = new ApolloClient({
    link: new HttpLink({ uri: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2' }),
    cache: new InMemoryCache(),
    shouldBatch: true,
})