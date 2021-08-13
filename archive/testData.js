import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

function useSubGraphClient() {
    return new ApolloClient({
        link: new HttpLink({
            uri: "https://api.thegraph.com/subgraphs/name/luzzif/swapr-mainnet-alpha",
        }),
        cache: new InMemoryCache(),
        shouldBatch: true,
    });
}

async function getTestData( client ) {
    try {
        //fetch th global data
        let result = await client.query({
            query: gql`
              query pairs {
                    pairs(first: 5) {
                        id
                    }
                }
            `,
            fetchPolicy: "network-only",
        });
        console.log("Success: " + result.data.pairs[0].id)
        return result;
    } catch (e) {
        console.log(e);
    }
    return undefined;
}

export default function useTestData() {
    const client = useSubGraphClient();
    async function fetchData() {
        await getTestData( client );
    }
    fetchData(); 
} 