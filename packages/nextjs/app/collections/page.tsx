"use client";

import { Collection } from "./components/collection";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useLaunchpad } from "~~/hooks/nft-minting/useLaunchpad";

const CollectionsPage: NextPage = () => {
  const launchpad = useLaunchpad();
  const { data: registry } = useQuery({
    queryKey: ["registry"],
    queryFn: async () => {
      return (
        await launchpad.view.get_registry({
          typeArguments: [],
          functionArguments: [],
        })
      )[0];
    },
  });

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {registry &&
          registry.map((item: any, index: any) => (
            <div key={index} className="flex justify-center">
              <Collection collectionAddress={item.inner} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
