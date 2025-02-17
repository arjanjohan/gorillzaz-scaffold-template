import { useAptosClient } from "../scaffold-move/useAptosClient";
import { useTargetNetwork } from "../scaffold-move/useTargetNetwork";
import { createSurfClient } from "@thalalabs/surf";
import deployedModules from "~~/modules/deployedModules";

export function useLaunchpad() {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const client = createSurfClient(aptosClient);

  return client.useABI(deployedModules[250].launchpad_double_whitelist.abi);
}
