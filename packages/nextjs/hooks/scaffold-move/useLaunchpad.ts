import { useAptosClient } from "./useAptosClient";
import { useTargetNetwork } from "./useTargetNetwork";
import { createSurfClient } from "@thalalabs/surf";
import deployedModules from "~~/modules/deployedModules";

export function useLaunchpad() {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const client = createSurfClient(aptosClient);

  return client.useABI(deployedModules[2].launchpad_double_whitelist.abi);
}
