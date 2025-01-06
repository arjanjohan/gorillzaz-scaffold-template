import { AccountInfo } from "@aptos-labs/wallet-adapter-react";
import { useView } from "~~/hooks/scaffold-move/useView";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

interface MintStageProps {
  stageName: string;
  collectionAddress: string;
  account?: AccountInfo;
  isMintEnabled: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const MintStage = ({
  stageName,
  collectionAddress,
  account,
  quantity = 0,
  onQuantityChange,
}: MintStageProps) => {
  const { data: isAllowlisted } = account
    ? useView({
        moduleName: MODULE_NAME,
        functionName: "is_allowlisted",
        args: [collectionAddress, stageName, account.address],
      })
    : { data: undefined };

  const { data: price } = useView({
    moduleName: MODULE_NAME,
    functionName: "get_mint_fee",
    args: [collectionAddress, stageName, 1],
  });

  const { data: walletLimit } = account
    ? useView({
        moduleName: MODULE_NAME,
        functionName: "get_mint_balance",
        args: [collectionAddress, stageName, account.address],
      })
    : { data: undefined };

  console.log("WALLET LIMIT", walletLimit);

  const { data: stageTimes } = useView({
    moduleName: MODULE_NAME,
    functionName: "get_mint_stage_start_and_end_time",
    args: [collectionAddress, stageName],
  });
  const startTime = stageTimes ? stageTimes[0] : 0;
  const endTime = stageTimes ? stageTimes[1] : 0;
  const stageStartTime = new Date(Number(startTime) * 1000);
  const stageEndTime = new Date(Number(endTime) * 1000);
  const now = new Date();

  const stageStatus = (() => {
    if (now < stageStartTime) return "NOT_STARTED";
    if (now > stageEndTime) return "FINISHED";
    if (stageEndTime.getFullYear() > 2100) return "PERMANENT";
    return "ACTIVE";
  })();

  const stageStatusText = {
    NOT_STARTED: "STARTING ON:",
    ACTIVE: "OPEN UNTIL:",
    FINISHED: "CLOSED",
    PERMANENT: "OPEN",
  }[stageStatus];

  const StageTimeInfo = {
    NOT_STARTED: stageStartTime,
    ACTIVE: stageEndTime,
    FINISHED: "",
    PERMANENT: "",
  }[stageStatus];

  const isActive = stageStatus === "PERMANENT" || stageStatus === "ACTIVE";

  return (
    <div className={`space-y-4 ${!isActive ? "opacity-50" : ""}`}>
      <h3 className="text-xl uppercase">{stageName}</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-3 text-sm">
          <span className="border-t-2 mr-4 border-gray-300 pt-2">PRICE</span>
          <span className="border-t-2 mr-4 border-gray-300 pt-2">WALLET LIMIT</span>
          <span className="border-t-2 mr-4 border-gray-300 pt-2">{stageStatusText}</span>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <span>{price} APT</span>
          <span>{walletLimit > 0 || isAllowlisted ? walletLimit : "N/A"}</span>
          <span>{StageTimeInfo.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-square"
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          disabled={quantity <= 0 || !isActive}
        >
          −
        </button>
        <input
          type="number"
          className="input input-bordered flex-1 text-center"
          value={quantity}
          onChange={e => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val >= 0 && isActive) {
              onQuantityChange(val);
            }
          }}
          min="0"
          disabled={!isActive}
        />
        <button className="btn btn-square" onClick={() => onQuantityChange(Math.min(walletLimit, quantity + 1))} disabled={quantity >= walletLimit || !isActive}>
          +
        </button>
      </div>
    </div>
  );
};
