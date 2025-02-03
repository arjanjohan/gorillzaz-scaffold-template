import { useEffect, useState } from "react";
import Link from "next/link";
import NftImage from "~~/components/nft-minting/nft-image";
import { Address } from "~~/components/scaffold-move/Address";
import { useGetCollectionItemDetails } from "~~/hooks/nft-minting/useGetCollectionItemDetails";

interface ItemProps {
  tokenAddress: string;
  collectionAddress: string;
}

export const NftItem = ({ tokenAddress, collectionAddress }: ItemProps) => {
  const { data: itemDetails } = useGetCollectionItemDetails(tokenAddress);
  const [imgUrl, setImgUrl] = useState<string>("/placeholder.png");

  useEffect(() => {
    if (itemDetails.token_image) {
      setImgUrl(itemDetails.token_image);
    }
  }, [itemDetails.token_image]);

  return (
    <div className="w-full max-w-[280px] p-6 bg-base-100 rounded-xl shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
      <Link href={`/${collectionAddress}/${tokenAddress}`}>
        <h2 className="text-lg font-bold">{itemDetails.token_name ? itemDetails.token_name : "Unnamed"}</h2>
        <NftImage imgUri={imgUrl} />
      </Link>
      <div className="text-sm text-base-content/70">
        Collection: <Address address={itemDetails.collection_address} size="xs" />
      </div>
    </div>
  );
};
