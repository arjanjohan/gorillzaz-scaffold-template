"use client";

import { useParams } from "next/navigation";
import { Stage } from "./components/stage";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { useView } from "~~/hooks/scaffold-move/useView";

const CollectionDetailsPage: NextPage = () => {
  const { account } = useWallet();
  const params = useParams();
  const collectionAddress =
    typeof params["collection-address"] === "string" ? params["collection-address"] : params["collection-address"][0];

  const { data: stages } = useView({
    moduleName: "mint_stage",
    functionName: "stages",
    args: [collectionAddress],
  });

  return (
    <div className="container mx-auto p-8">
      {!account && <h1 className="text-xl font-bold mb-4">Connect your Wallet to see if you are on the WL!</h1>}

      {account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages?.map((stageName: string, index: number) => (
            <Stage
              key={index}
              collectionAddress={collectionAddress}
              stageName={stageName}
              accountAddress={account?.address}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CollectionDetailsPage;
