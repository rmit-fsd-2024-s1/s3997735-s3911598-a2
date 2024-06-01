// import { ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink } from '@apollo/client';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
// import React from 'react';
//
// // HTTP connection to the API
// const httpLink = new HttpLink({
//     uri: 'http://localhost:4000/graphql', // GraphQL endpoint
// });
//
// // Create a WebSocket link:
// const wsLink = new WebSocketLink({
//     uri: `ws://localhost:4000/graphql`,
//     options: {
//         reconnect: true,
//     },
// });
//
// // Using the split function to split data fetching based on operation type
// const splitLink = split(
//     ({ query }) => {
//         const definition = getMainDefinition(query);
//         return (
//             definition.kind === 'OperationDefinition' &&
//             definition.operation === 'subscription'
//         );
//     },
//     wsLink,
//     httpLink,
// );
//
// // Create the Apollo Client
// const client = new ApolloClient({
//     link: splitLink,
//     cache: new InMemoryCache(),
// });
//
// const ApolloProviderWrapper = ({ children }) => (
//     <ApolloProvider client={client}>
//         {children}
//     </ApolloProvider>
// );
//
// export default ApolloProviderWrapper;


import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";

const link = new GraphQLWsLink(
    createClient({
        url: GRAPHQL_ENDPOINT,
    })
);

const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache
});

export default client;
