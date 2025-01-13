import { useAptosClient } from "../scaffold-move/useAptosClient";
import { useTargetNetwork } from "../scaffold-move/useTargetNetwork";
import { createSurfClient } from "@thalalabs/surf";
import externalModules from "~~/modules/externalModules";

export function useMintStages() {
  const network = useTargetNetwork();
  const aptosClient = useAptosClient(network.targetNetwork.id);
  const client = createSurfClient(aptosClient);

  return client.useABI(externalModules[2].mint_stage.abi);
}
