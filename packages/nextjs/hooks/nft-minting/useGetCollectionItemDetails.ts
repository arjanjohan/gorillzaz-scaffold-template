import { useGetIpfsMetadata } from "./useGetIpfsMetadata";
import { useGetAccountResource } from "~~/hooks/scaffold-move/useGetAccountResource";
import { TokenMetadata } from "~~/utils/nft-minting/ipfsUploader";
import { getIpfsHash } from "~~/utils/nft-minting/ipfsUploader";

export interface CollectionItemDetails {
  collection_address: string;
  collection_name: string;
  uri: string;
  token_name: string;
  token_description: string;
  token_image: string;
  attributes: any[];
}

export function useGetCollectionItemDetails(itemAddress: string) {
  const { data: tokenResource } = useGetAccountResource("token", "Token", "0x4", itemAddress);
  const tokenIpfsHash = tokenResource?.uri ? getIpfsHash(tokenResource.uri) : "";
  const { data: itemIpfsMetadata } = useGetIpfsMetadata<TokenMetadata>(tokenIpfsHash);
  const data: CollectionItemDetails = {
    collection_address: tokenResource?.collection.inner,
    collection_name: tokenResource?.name,
    uri: tokenResource?.uri,
    token_name: itemIpfsMetadata?.name || "",
    token_description: itemIpfsMetadata?.description || "",
    token_image: itemIpfsMetadata?.image || "",
    attributes: itemIpfsMetadata?.attributes || [],
  };

  return { data };
}
