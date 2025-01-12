import { useQuery } from "@tanstack/react-query";
import { useLaunchpad } from "~~/hooks/scaffold-move/useLaunchpad";

export function useMintStage(
  collectionAddress: `0x${string}`,
  stageName: string,
  accountAddress: `0x${string}` | undefined,
) {
  console.log("COLLECTION ADDRESS", collectionAddress);
  console.log("STAGE NAME", stageName);
  console.log("ACCOUNT ADDRESS", accountAddress);

  const launchpad = useLaunchpad();

  return useQuery({
    queryKey: ["mintStage", collectionAddress, stageName, accountAddress],
    queryFn: async () => {
      const isAllowlisted = accountAddress
        ? launchpad.view.is_allowlisted({
            functionArguments: [collectionAddress, stageName, accountAddress],
            typeArguments: [],
          })
        : undefined;

      const mintFee = launchpad.view.get_mint_fee({
        functionArguments: [collectionAddress, stageName, 1],
        typeArguments: [],
      });

      const stageTimes = launchpad.view.get_mint_stage_start_and_end_time({
        functionArguments: [collectionAddress, stageName],
        typeArguments: [],
      });

      const mintBalance = accountAddress
        ? launchpad.view.get_mint_balance({
            functionArguments: [collectionAddress, stageName, accountAddress],
            typeArguments: [],
          })
        : undefined;

      return {
        isAllowlisted: (await isAllowlisted)?.[0],
        mintFee: (await mintFee)?.[0],
        stageTimes: await stageTimes,
        mintBalance: parseInt((await mintBalance)?.[0] ?? "0"),
      };
    },
  });
}
