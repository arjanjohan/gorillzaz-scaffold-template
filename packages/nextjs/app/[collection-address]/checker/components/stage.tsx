import { useView } from "~~/hooks/scaffold-move/useView";

interface StageProps {
  collectionAddress: string;
  stageName: string;
  accountAddress?: string;
}

export const Stage = ({ collectionAddress, stageName, accountAddress }: StageProps) => {
  const { data: stageData } = useView({
    moduleName: "mint_stage",
    functionName: "find_mint_stage_index_by_name",
    args: [collectionAddress, stageName],
  });
  const stageIndex = stageData?.[0];

  const { data: isAllowlisted } = useView({
    moduleName: "mint_stage",
    functionName: "is_allowlisted",
    args: [collectionAddress, stageIndex, accountAddress],
  });

  const { data: allowlistBalance } = useView({
    moduleName: "mint_stage",
    functionName: "allowlist_balance",
    args: [collectionAddress, stageIndex, accountAddress],
  });

  const { data: startTime } = useView({
    moduleName: "mint_stage",
    functionName: "start_time",
    args: [collectionAddress, stageIndex],
  });

  const { data: endTime } = useView({
    moduleName: "mint_stage",
    functionName: "end_time",
    args: [collectionAddress, stageIndex],
  });

  const { data: isStageAllowlisted } = useView({
    moduleName: "mint_stage",
    functionName: "is_stage_allowlisted",
    args: [collectionAddress, stageIndex],
  });

  return (
    <div className="card bg-base-200 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">{stageName}</h2>
      <div className="space-y-2">
        <p>Start Time: {new Date(Number(startTime) * 1000).toLocaleString()}</p>
        <p>End Time: {new Date(Number(endTime) * 1000).toLocaleString()}</p>
        {isStageAllowlisted && (
          <>
            <p>{isAllowlisted ? "✅ Allowlisted" : "❌ Not Allowlisted"}</p>
            {isAllowlisted && <p>Allocation: {allowlistBalance || 0}</p>}
          </>
        )}
      </div>
    </div>
  );
};
