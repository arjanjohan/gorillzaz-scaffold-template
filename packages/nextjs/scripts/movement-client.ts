import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { Network } from "aptos";

export function getAptosClient(network: Network, fullnode: string, indexer: string) {
  const aptosConfig = new AptosConfig({
    network,
    fullnode,
    indexer,
  });
  const aptosClient = new Aptos(aptosConfig);

  return { aptosClient };
}
