"use client";

import Image from "next/image";

interface NftImageProps {
  imgUri: string;
}

const NftImage = ({ imgUri }: NftImageProps) => {
  if (!imgUri) return null;

  return (
    <div className="w-full aspect-square relative rounded-xl overflow-hidden">
      <Image src={imgUri} alt="Collection Logo" fill className="rounded-xl object-contain bg-base-300 p-4" />
    </div>
  );
};

export default NftImage;
