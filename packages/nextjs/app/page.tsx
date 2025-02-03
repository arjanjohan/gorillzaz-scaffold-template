"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { COLLECTION_ID } from "~~/env";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Gorilla Moverz Community Collection</span>
            <span className="block text-xl">The most gorillish community collection on Movement</span>
          </h1>
        </div>

        <div className="flex-grow w-full px-8 py-12">
          <div className="flex justify-center items-start gap-8 flex-col max-w-2xl mx-auto">
            <div className="flex items-center gap-6 w-full bg-base-100 p-6 rounded-xl">
              <DocumentDuplicateIcon className="h-12 w-12 flex-shrink-0 text-primary" />
              <div>
                <h2 className="text-xl font-bold mb-2">WL Checker</h2>
                <p>
                  <Link href={`${COLLECTION_ID}/checker`} className="link link-primary">
                    See if you are on the WL
                  </Link>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
