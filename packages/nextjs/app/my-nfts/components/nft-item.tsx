import { useEffect, useState } from "react";
import Link from "next/link";
import NftImage from "~~/components/nft-minting/nft-image";
import { Address } from "~~/components/scaffold-move/Address";
import { getIpfsUrl } from "~~/utils/nft-minting/ipfsUploader";

interface ItemProps {
  tokenAddress: string;
  collectionAddress: string;
  name: string;
  image: string;
}

export const NftItem = ({ tokenAddress, collectionAddress, name, image }: ItemProps) => {
  const [imgUrl, setImgUrl] = useState<string>("/placeholder.png");

  useEffect(() => {
    if (image) {
      setImgUrl(getIpfsUrl(image));
    }
  }, [image]);

  return (
    <div className="w-full max-w-[280px] p-6 bg-base-100 rounded-xl shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
      <Link href={`/${collectionAddress}/${tokenAddress}`}>
        <h2 className="text-lg font-bold">{name ? name : "Unnamed"}</h2>
        <NftImage imgUri={imgUrl} />
      </Link>
      <div className="text-sm text-base-content/70">
        Collection: <Address address={collectionAddress} size="xs" />
      </div>
    </div>
  );
};
