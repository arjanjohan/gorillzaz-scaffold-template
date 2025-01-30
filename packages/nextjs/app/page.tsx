"use client";

import type { NextPage } from "next";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

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
                <h2 className="text-xl font-bold mb-2">1. Fork and Setup (Optional)</h2>
                <p>
                  Start by forking the{" "}
                  <a
                    href="https://github.com/arjanjohan/scaffold-move/tree/nft-minting"
                    className="link link-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    repository
                  </a>{" "}
                  and following the setup instructions in the README.
                </p>
                <pre className="mt-2 p-2 bg-base-200 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  git clone --branch nft-minting --single-branch git@github.com:arjanjohan/scaffold-move.git
                </pre>
                <p>
                  If you don&apos;t intend to modify the contract code, you can also use this website to create
                  collections.
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
