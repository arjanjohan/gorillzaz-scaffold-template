"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { NextPage } from "next";
import { Input } from "~~/components/Input";
import { Address } from "~~/components/scaffold-move";
import { useGetModule } from "~~/hooks/scaffold-move/useGetModule";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

const Create: NextPage = () => {
  const { account } = useWallet();
  const router = useRouter();
  const network = useTargetNetwork();

  const [allowListEnabled, setAllowListEnabled] = useState(false);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [publicMintEnabled, setPublicMintEnabled] = useState(true);
  const [royaltyPercentage, setRoyaltyPercentage] = useState<number>();
  const [allowListAddresses, setAllowListAddresses] = useState<string[]>();
  const [allowListStartTime, setAllowListStartTime] = useState<string>();
  const [allowListEndTime, setAllowListEndTime] = useState<string>();
  const [allowListMintLimitPerAddr, setAllowListMintLimitPerAddr] = useState<number[]>();
  const [allowListMintFeePerNFT, setAllowListMintFeePerNFT] = useState<number>();
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>();
  const [whitelistStartTime, setWhitelistStartTime] = useState<string>();
  const [whitelistEndTime, setWhitelistEndTime] = useState<string>();
  const [whitelistMintLimitPerAddr, setWhitelistMintLimitPerAddr] = useState<number[]>();
  const [whitelistMintFeePerNFT, setWhitelistMintFeePerNFT] = useState<number>();
  const [publicMintStartTime, setPublicMintStartTime] = useState<string>();
  const [publicMintEndTime, setPublicMintEndTime] = useState<string>();
  const [publicMintLimitPerAddr, setPublicMintLimitPerAddr] = useState<number>();
  const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState<number>();
  const [files, setFiles] = useState<FileList | null>(null);

  // Local Ref
  const inputRef = useRef<HTMLInputElement>(null);

  // Internal state
  const [isUploading, setIsUploading] = useState(false);

  const { submitTransaction, transactionResponse } = useSubmitTransaction(MODULE_NAME);
  const launchpadModule = useGetModule(MODULE_NAME);

  const handleListUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setList: (addresses: string[]) => void,
    setLimits: (limits: number[]) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        const rows = text
          .split("\n")
          .map(line => line.trim())
          .filter(line => line)
          .map(line => line.split(",").map(item => item.trim()));

        const addresses: string[] = [];
        const limits: number[] = [];

        rows.forEach(row => {
          if (row.length === 2) {
            addresses.push(row[0]);
            limits.push(parseInt(row[1]));
          }
        });
        console.log("AVH CSV PARSED:");
        console.log(addresses, limits);
        setList(addresses);
        setLimits(limits);
      };
      reader.readAsText(file);
    }
  };

  // On create collection button clicked
  const createCollection = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      if (!files) throw new Error("Please upload files");
      if (isUploading) throw new Error("Uploading in progress");

      // Set internal isUploading state
      setIsUploading(true);

      const { uploadCollectionData } = await import("~~/utils/nft-minting/ipfsUploader");

      // Upload collection files to Irys
      const { collectionName, collectionDescription, uniqueItemCount, projectUri } = await uploadCollectionData(files);
      try {
        await submitTransaction("create_collection", [
          collectionDescription,
          collectionName,
          projectUri,
          uniqueItemCount,
          royaltyPercentage ? royaltyPercentage : 0,
          undefined, // ignore pre mint amount
          allowListAddresses,
          allowListMintLimitPerAddr,
          allowListStartTime ? new Date(allowListStartTime).getTime() / 1000 : undefined,
          allowListEndTime ? new Date(allowListEndTime).getTime() / 1000 : undefined,
          allowListMintFeePerNFT,
          whitelistAddresses,
          whitelistMintLimitPerAddr,
          whitelistStartTime ? new Date(whitelistStartTime).getTime() / 1000 : undefined,
          whitelistEndTime ? new Date(whitelistEndTime).getTime() / 1000 : undefined,
          whitelistMintFeePerNFT,
          publicMintStartTime ? new Date(publicMintStartTime).getTime() / 1000 : undefined,
          publicMintEndTime ? new Date(publicMintEndTime).getTime() / 1000 : undefined,
          publicMintLimitPerAddr,
          publicMintFeePerNFT ? publicMintFeePerNFT : 0,
        ]);

        if (transactionResponse?.transactionSubmitted) {
          console.log("Transaction successful:", transactionResponse.success ? "success" : "failed");
          router.push("/collections");
        }
      } catch (error) {
        console.error("Error submitting transaction:", error);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow">
      <div className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl p-6 mt-8 w-full max-w-lg">
        <div className="text-xl">Create Collection</div>
        <p className="text-sm mb-2">This page is for artists to upload their NFT collection.</p>
        <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
          <p className="my-2 font-medium">Launchpad Address:</p>
          <Address address={launchpadModule?.abi.address} />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 p-6 mt-8 w-full max-w-lg">
        <h2 className="text-lg font-semibold">Collection data</h2>
        <p className="text-sm">Uploads collection files to IPFS</p>

        <div className="flex flex-col items-start justify-between w-full">
          <Input
            ref={inputRef}
            id="upload"
            disabled={isUploading || !account}
            webkitdirectory="true"
            multiple
            type="file"
            placeholder="Upload Assets"
            className="file-input file-input-bordered w-full"
            onChange={event => {
              setFiles(event.currentTarget.files);
            }}
          />

          {!!files?.length && (
            <div>
              {files.length} files selected{" "}
              <button
                className="text-error"
                onClick={() => {
                  setFiles(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full">
            <div className="flex items-center ml-2 mb-2">
              <span className="text-xs font-medium mr-2 leading-none">Royalty fee (%)</span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              className="input input-bordered w-full"
              value={royaltyPercentage}
              onChange={e => setRoyaltyPercentage(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              placeholder="Optional"
            />
          </div>

          {/* Public Mint Settings */}
          <div className="w-full border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold">Public Mint Settings</h3>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={publicMintEnabled}
                onChange={e => setPublicMintEnabled(e.target.checked)}
              />
            </div>
            {publicMintEnabled && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">Start Time</span>
                  </div>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={publicMintStartTime}
                    onChange={e => setPublicMintStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">End Time</span>
                  </div>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={publicMintEndTime}
                    onChange={e => setPublicMintEndTime(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">Mint Limit Per Address</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    value={publicMintLimitPerAddr === undefined ? "" : publicMintLimitPerAddr}
                    onChange={e => {
                      const val = e.target.value === "" ? undefined : parseInt(e.target.value);
                      setPublicMintLimitPerAddr(val);
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">
                      Mint Fee ({network.targetNetwork.native_token_symbol || "APT"})
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="input input-bordered w-full"
                    value={publicMintFeePerNFT}
                    onChange={e => setPublicMintFeePerNFT(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Whitelist Settings */}
          <div className="w-full border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold">Whitelist Settings</h3>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={whitelistEnabled}
                onChange={e => setWhitelistEnabled(e.target.checked)}
              />
            </div>
            {whitelistEnabled && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">Whitelist Addresses (CSV)</span>
                  </div>
                  <input
                    type="file"
                    id="whitelist-upload"
                    accept=".csv,.txt"
                    className="file-input file-input-bordered w-full"
                    onChange={e => handleListUpload(e, setWhitelistAddresses, setWhitelistMintLimitPerAddr)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">Start Time</span>
                  </div>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={whitelistStartTime}
                    onChange={e => setWhitelistStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">End Time</span>
                  </div>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={whitelistEndTime}
                    onChange={e => setWhitelistEndTime(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">
                      Mint Fee ({network.targetNetwork.native_token_symbol || "APT"})
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="input input-bordered w-full"
                    value={whitelistMintFeePerNFT}
                    onChange={e => setWhitelistMintFeePerNFT(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Allowlist Settings */}
          <div className="w-full border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold">Allowlist Settings</h3>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={allowListEnabled}
                onChange={e => setAllowListEnabled(e.target.checked)}
              />
            </div>
            {allowListEnabled && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">Allowlist Addresses (CSV)</span>
                  </div>
                  <input
                    type="file"
                    id="allowlist-upload"
                    accept=".csv,.txt"
                    className="file-input file-input-bordered w-full"
                    onChange={e => handleListUpload(e, setAllowListAddresses, setAllowListMintLimitPerAddr)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">Start Time</span>
                  </div>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={allowListStartTime}
                    onChange={e => setAllowListStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">End Time</span>
                  </div>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={allowListEndTime}
                    onChange={e => setAllowListEndTime(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center ml-2 mb-2">
                    <span className="text-xs font-medium mr-2 leading-none">
                      Mint Fee ({network.targetNetwork.native_token_symbol || "APT"})
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="input input-bordered w-full"
                    value={allowListMintFeePerNFT}
                    onChange={e => setAllowListMintFeePerNFT(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error message if no stage is enabled */}
          {!publicMintEnabled && !whitelistEnabled && !allowListEnabled && (
            <div className="text-error text-sm">At least one minting stage must be enabled</div>
          )}
        </div>

        <button className="btn btn-secondary mt-2" disabled={!account} onClick={createCollection}>
          Create collection
        </button>
      </div>
    </div>
  );
};

export default Create;
