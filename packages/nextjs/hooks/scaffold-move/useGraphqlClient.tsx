import React from "react";
import { useEffect, useState } from "react";
import { Network, NetworkName } from "../../constants";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

function getIsGraphqlClientSupportedFor(networkName: NetworkName): boolean {
  const graphqlUri = getGraphqlURI(networkName);
  return typeof graphqlUri === "string" && graphqlUri.length > 0;
}

export function getGraphqlURI(networkName: NetworkName): string | undefined {
  switch (networkName) {
    case "mainnet":
      return "https://api.mainnet.aptoslabs.com/v1/graphql";
    case "testnet":
      return "https://api-staging.testnet.aptoslabs.com/v1/graphql";
    case "devnet":
      return "https://api-staging.devnet.aptoslabs.com/v1/graphql";
    case "local":
      return "http://127.0.0.1:8090/v1/graphql";
    case "randomnet":
      return "https://indexer.random.aptoslabs.com/v1/graphql";
    default:
      return undefined;
  }
}

function getGraphqlClient(networkName: NetworkName): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link: new HttpLink({
      uri: getGraphqlURI(networkName),
    }),
    cache: new InMemoryCache(),
  });
}

export function useGetGraphqlClient() {
  const state = { network_name: Network.DEVNET, network_value: "https://aptos.devnet.m1.movementlabs.xyz" };

  const [graphqlClient, setGraphqlClient] = useState<ApolloClient<NormalizedCacheObject>>(
    getGraphqlClient(state.network_name),
  );

  useEffect(() => {
    setGraphqlClient(getGraphqlClient(state.network_name));
  }, [state.network_name]);

  return graphqlClient;
}

type GraphqlClientProviderProps = {
  children: React.ReactNode;
};

export function GraphqlClientProvider({ children }: GraphqlClientProviderProps) {
  const graphqlClient = useGetGraphqlClient();

  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
}

export function useGetIsGraphqlClientSupported(): boolean {
  const state = { network_name: Network.DEVNET, network_value: "https://aptos.devnet.m1.movementlabs.xyz" };

  const [isGraphqlClientSupported, setIsGraphqlClientSupported] = useState<boolean>(
    getIsGraphqlClientSupportedFor(state.network_name),
  );

  useEffect(() => {
    setIsGraphqlClientSupported(getIsGraphqlClientSupportedFor(state.network_name));
  }, [state.network_name]);

  return isGraphqlClientSupported;
}
