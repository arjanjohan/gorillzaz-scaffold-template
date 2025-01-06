"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import MintOverview from "./components/mint-overview";
import { MintStage } from "./components/mint-stage";
import MintStats from "./components/mint-stats";
import type { NextPage } from "next";
import NftImage from "~~/components/nft-minting/nft-image";
import { Address } from "~~/components/scaffold-move/Address";
import { useGetCollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";
import { useView } from "~~/hooks/scaffold-move/useView";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const LAUNCHPAD_MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";
const MINT_STAGE_MODULE_NAME = "mint_stage";

const CollectionDetailsPage: NextPage = () => {
  const { account } = useWallet();
  const params = useParams();
  const collectionAddress =
    typeof params["collection-address"] === "string" ? params["collection-address"] : params["collection-address"][0];

  const { data: collectionDetails } = useGetCollectionDetails(collectionAddress);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const { data: stages } = useView({
    moduleName: MINT_STAGE_MODULE_NAME,
    functionName: "stages",
    args: [collectionAddress],
  });

  const { data: isMintEnabled } = useView({
    moduleName: LAUNCHPAD_MODULE_NAME,
    functionName: "is_mint_enabled",
    args: [collectionAddress],
  });

  const handleQuantityChange = (stageName: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [stageName]: quantity }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{collectionDetails?.collection_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-6 md:col-span-2">
          <NftImage imgUri={collectionDetails?.cdn_asset_uris?.cdn_image_uri ?? "/placeholder.png"} />
        </div>

        <div className="space-y-6 md:col-span-3">
          <div className="p-6 bg-base-100 rounded-xl">
            <p>{collectionDetails?.description ?? ""}</p>
            <div className="flex gap-x-2 items-center flex-wrap justify-between">
              <p className="whitespace-nowrap text-sm">Collection Address</p>
              <Address address={collectionAddress} size="sm" />
            </div>
          </div>

          <div className="p-6 bg-base-100 rounded-xl">
            <div className="space-y-4">
              {stages?.map((stageName: string) => (
                <MintStage
                  key={stageName}
                  stageName={stageName}
                  collectionAddress={collectionAddress}
                  // TODO: It fails when using the account address from the wallet somehow, investigate why and fix.
                  account={account ?? undefined}
                  isMintEnabled={!!isMintEnabled}
                  quantity={quantities[stageName] || 0}
                  onQuantityChange={quantity => handleQuantityChange(stageName, quantity)}
                />
              ))}
            </div>
          </div>

          {totalQuantity > 0 && (
            <MintOverview collectionDetails={collectionDetails} quantities={quantities}/>
          )}
          <MintStats collectionDetails={collectionDetails} />
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsPage;
