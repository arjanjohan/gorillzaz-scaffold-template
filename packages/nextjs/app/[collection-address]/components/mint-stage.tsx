import { useMintStage } from "./useMintStage";
import { AccountInfo } from "@aptos-labs/wallet-adapter-react";
import { useView } from "~~/hooks/scaffold-move/useView";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

interface MintStageProps {
  stageName: string;
  collectionAddress: `0x${string}`;
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
  const { data: mintData } = useMintStage(collectionAddress, stageName, account?.address as `0x${string}`);
  console.log("MINT DATA", mintData);

  const startTime = mintData?.stageTimes ? mintData?.stageTimes[0] : 0;
  const endTime = mintData?.stageTimes ? mintData?.stageTimes[1] : 0;
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

  if (!mintData) return null;

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
          <span>{mintData.mintFee} APT</span>
          <span>{mintData.mintBalance > 0 || mintData?.isAllowlisted ? mintData?.mintBalance : "N/A"}</span>
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
        <button
          className="btn btn-square"
          onClick={() => onQuantityChange(Math.min(mintData.mintBalance, quantity + 1))}
          disabled={quantity >= mintData.mintBalance || !isActive}
        >
          +
        </button>
      </div>
    </div>
  );
};
