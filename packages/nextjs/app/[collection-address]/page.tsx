"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import MintOverview from "./components/mint-overview";
import { MintStage } from "./components/mint-stage";
import MintStats from "./components/mint-stats";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import NftImage from "~~/components/nft-minting/nft-image";
import { Address } from "~~/components/scaffold-move/Address";
import { MINT_PAGE_ENABLED } from "~~/env";
import { useGetCollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";
import { useGetIpfsMetadata } from "~~/hooks/nft-minting/useGetIpfsMetadata";
import { useLaunchpad } from "~~/hooks/nft-minting/useLaunchpad";
import { useMintStages } from "~~/hooks/nft-minting/useMintStages";
import { getIpfsHash, getIpfsUrl } from "~~/utils/nft-minting/ipfsUploader";
import { CollectionMetadata } from "~~/utils/nft-minting/ipfsUploader";

const CollectionDetailsPage: NextPage = () => {
  const launchpad = useLaunchpad();
  const mintStages = useMintStages();
  const { account } = useWallet();
  const params = useParams();
  const collectionAddress = (
    typeof params["collection-address"] === "string" ? params["collection-address"] : params["collection-address"][0]
  ) as `0x${string}`;

  const { data: collectionDetails } = useGetCollectionDetails(collectionAddress);
  const ipfs_metadata = useGetIpfsMetadata<CollectionMetadata>(
    collectionDetails?.uri ? getIpfsHash(collectionDetails.uri) : "",
  ).data;

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const { data: stages } = useQuery({
    queryKey: ["stages", collectionAddress],
    queryFn: async () => {
      return (
        await mintStages.view.stages({
          functionArguments: [collectionAddress],
          typeArguments: [],
        })
      )[0];
    },
  });

  const { data: isMintEnabled } = useQuery({
    queryKey: ["isMintEnabled", collectionAddress],
    queryFn: async () => {
      return (
        await launchpad.view.is_mint_enabled({
          functionArguments: [collectionAddress],
          typeArguments: [],
        })
      )[0];
    },
  });

  const handleQuantityChange = (stageName: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [stageName]: quantity }));
  };

  if (!collectionDetails || !ipfs_metadata) {
    return null;
  }
  const imgUrl = getIpfsUrl(ipfs_metadata.image);

  if (!MINT_PAGE_ENABLED) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-2xl font-bold mb-4">Mint page not yet enabled</div>
        <div className="text-sm">This page is not yet enabled. Please check back later.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{collectionDetails?.collection_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-6 md:col-span-2">
          <NftImage imgUri={imgUrl ?? "/placeholder.png"} />
        </div>

        <div className="space-y-6 md:col-span-3">
          <div className="p-6 bg-base-100 rounded-xl">
            <p>{collectionDetails?.description ?? ""}</p>
            <div className="flex gap-x-2 items-center flex-wrap justify-between">
              <p className="whitespace-nowrap text-sm">Collection Address</p>
              <Address address={collectionAddress} size="sm" />
            </div>
          </div>
          <MintStats collectionDetails={collectionDetails} />

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

          {totalQuantity > 0 && <MintOverview collectionDetails={collectionDetails} quantities={quantities} />}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsPage;
