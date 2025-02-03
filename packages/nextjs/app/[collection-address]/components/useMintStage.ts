import { useQuery } from "@tanstack/react-query";
import { useLaunchpad } from "~~/hooks/nft-minting/useLaunchpad";

export function useMintStage(
  collectionAddress: `0x${string}`,
  stageName: string,
  accountAddress: `0x${string}` | undefined,
) {
  const launchpad = useLaunchpad();

  return useQuery({
    queryKey: ["mintStage", collectionAddress, stageName, accountAddress],
    queryFn: async () => {
      let isAllowlisted = false;
      if (stageName === "Public mint stage") {
        isAllowlisted = true;
      } else if (accountAddress) {
        try {
          isAllowlisted = (
            await launchpad.view.is_allowlisted({
              functionArguments: [collectionAddress, stageName, accountAddress],
              typeArguments: [],
            })
          )[0];
        } catch (error) {}
      }

      const mintFee = (
        await launchpad.view.get_mint_fee({
          functionArguments: [collectionAddress, stageName, 1],
          typeArguments: [],
        })
      )[0];

      const stageTimes = launchpad.view.get_mint_stage_start_and_end_time({
        functionArguments: [collectionAddress, stageName],
        typeArguments: [],
      });

      let mintBalance = "0";
      if (accountAddress) {
        try {
          mintBalance = (
            await launchpad.view.get_mint_balance({
              functionArguments: [collectionAddress, stageName, accountAddress],
              typeArguments: [],
            })
          )[0];
        } catch (error) {}
      }

      return {
        isAllowlisted,
        mintFee,
        stageTimes: await stageTimes,
        mintBalance: parseInt(mintBalance),
      };
    },
  });
}
