"use client";

import { CollectionDetails } from "~~/hooks/nft-minting/useGetCollectionDetails";
import useSubmitTransaction from "~~/hooks/scaffold-move/useSubmitTransaction";
import { useView } from "~~/hooks/scaffold-move/useView";

const MODULE_NAME = process.env.NEXT_PUBLIC_MODULE_NAME ?? "launchpad";

interface MintOverviewProps {
  collectionDetails: CollectionDetails;
  quantities: { [key: string]: number };
}

const MintOverview = ({ collectionDetails, quantities }: MintOverviewProps) => {
  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const collectionAddress = collectionDetails.collection_address;
  const availableMints = collectionDetails?.max_supply - collectionDetails?.current_supply;
  const { submitTransaction } = useSubmitTransaction(MODULE_NAME);

  // Get price for each stage
  // TODO: this errors. Store the price per stage somewhere in storage instead. It is retrieved by the MintStage component.
  const stagePrices = Object.keys(quantities).reduce<{ [key: string]: number }>((acc, stageName) => {
    const { data: price } = useView({
      moduleName: MODULE_NAME,
      functionName: "get_mint_fee",
      args: [collectionAddress, stageName, 1],
    });
    acc[stageName] = price || 0;
    return acc;
  }, {});

  const totalPrice =
    Object.entries(quantities).reduce((sum, [stageName, quantity]) => {
      return sum + quantity * (stagePrices[stageName] || 0);
    }, 0) / Math.pow(10, 8);

  const handleMint = async () => {
    if (!totalQuantity) return;

    // Convert quantities object to arrays for the transaction
    const stageNames = Object.keys(quantities).filter(stage => quantities[stage] > 0);
    const mintAmounts = stageNames.map(stage => quantities[stage]);
    const mintAmount = mintAmounts.reduce((sum, amount) => sum + amount, 0);

    await submitTransaction("mint_nft", [collectionAddress, mintAmount]);
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-base-300 rounded-lg shadow-xl w-96">
      <div className="flex justify-between items-center mb-2">
        <span>ITEM</span>
        <div className="flex gap-8">
          <span>QTY</span>
          <span>PRICE</span>
        </div>
      </div>

      {Object.entries(quantities).map(
        ([stageName, qty]) =>
          qty > 0 && (
            <div key={stageName} className="flex justify-between items-center">
              <span>{stageName}</span>
              <div className="flex gap-8">
                <span>x{qty}</span>
                <span>{((qty * (stagePrices[stageName] || 0)) / Math.pow(10, 8)).toFixed(1)} APT</span>
              </div>
            </div>
          ),
      )}

      <div className="border-t border-base-content/20 mt-2 pt-2">
        <div className="flex justify-between items-center">
          <span>TOTAL →</span>
          <div className="flex gap-8">
            <span>x{totalQuantity}</span>
            <span>{totalPrice.toFixed(1)} APT</span>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary w-full mt-4"
        onClick={handleMint}
        disabled={!totalQuantity || totalQuantity > availableMints}
      >
        {!totalQuantity ? "SELECT QUANTITY" : totalQuantity > availableMints ? "EXCEEDS AVAILABLE SUPPLY" : "MINT"}
      </button>
    </div>
  );
};

export default MintOverview;
