import deployedModules from "../modules/deployedModules";
import { getSigner } from "./aptos-helper";
import { convertToAmount, parseYaml } from "./helper";
import { getAptosClient } from "./movement-client";
import { UserTransactionResponse } from "@aptos-labs/ts-sdk";
import { createSurfClient } from "@thalalabs/surf";
import { Network } from "aptos";
import fs from "fs";
import path from "path";

const configYamlPath = path.join(__dirname, "../../move/.aptos/config.yaml");

const config = parseYaml(configYamlPath) as any;
const nodeUrl = config.profiles.default.rest_url + "/v1";
const accountAddress = config.profiles.default.account.replace(/^0x/, ""); // Strip 0x from the account address

const admin = getSigner(configYamlPath);
const { aptosClient } = getAptosClient(
  Network.TESTNET,
  nodeUrl,
  "https://api.testnet.staging.aptoslabs.com/v1/graphql",
);
const launchpadClient = createSurfClient(aptosClient).useABI(deployedModules[2].launchpad_double_whitelist.abi);

async function main() {
  // await setupAllowlist();
  const price = convertToAmount(1, 8);
  await createCollection({
    description: "GCC",
    name: "GCC",
    uri: "ipfs://bafybeicwslqt67huigwnx525j2gdb2maeyhdnp4dhhouxcckkeld4sk47u/collection.json",
    max_supply: 3000,
    royalty_percentage: 5,
    pre_mint_amount: 200,
    guaranteed_allowlist_addresses: [admin.accountAddress.toString()],
    guaranteed_allowlist_mint_limit_per_addr: [1],
    guaranteed_allowlist_start_time: new Date(2025, 0, 30, 0, 0, 0).getTime() / 1000,
    guaranteed_allowlist_end_time: new Date(2025, 0, 31, 0, 0, 0).getTime() / 1000,
    guaranteed_allowlist_mint_fee_per_nft: price,
    fcfs_allowlist_addresses: [admin.accountAddress.toString()],
    fcfs_allowlist_mint_limit_per_addr: [1],
    fcfs_allowlist_start_time: new Date(2025, 0, 31, 0, 0, 0).getTime() / 1000,
    fcfs_allowlist_end_time: new Date(2025, 1, 1, 0, 0, 0).getTime() / 1000,
    fcfs_allowlist_mint_fee_per_nft: price,
    public_mint_start_time: new Date(2025, 1, 1, 0, 0, 0).getTime() / 1000,
    public_mint_end_time: new Date(2025, 1, 2, 0, 0, 0).getTime() / 1000,
    public_mint_limit_per_addr: 1,
    public_mint_fee_per_nft: price,
  });

  // await reveal("0x7d78fc0346f44cd77a47eb09a0e3d9c7bbf358c2d6fe8828d62d32abcb6c6b65");
}

interface CreateCollectionParams {
  description: string;
  name: string;
  uri: string;
  max_supply: number;
  royalty_percentage: number | undefined;
  // Pre mint amount to creator
  pre_mint_amount: number | undefined;
  // Whitelist of addresses that can mint NFTs in whitelist stage
  guaranteed_allowlist_addresses: `0x${string}`[] | undefined;
  guaranteed_allowlist_mint_limit_per_addr: number[] | undefined;
  guaranteed_allowlist_start_time: number | undefined;
  guaranteed_allowlist_end_time: number | undefined;
  guaranteed_allowlist_mint_fee_per_nft: number | undefined;
  // Allowlist of addresses that can mint NFTs in allowlist stage
  fcfs_allowlist_addresses: `0x${string}`[] | undefined;
  fcfs_allowlist_mint_limit_per_addr: number[] | undefined;
  fcfs_allowlist_start_time: number | undefined;
  fcfs_allowlist_end_time: number | undefined;
  fcfs_allowlist_mint_fee_per_nft: number | undefined;
  public_mint_start_time: number | undefined;
  public_mint_end_time: number | undefined;
  // Public mint limit per address
  public_mint_limit_per_addr: number | undefined;
  public_mint_fee_per_nft: number | undefined;
}

async function createCollection(params: CreateCollectionParams) {
  const response = (await launchpadClient.entry.create_collection({
    account: admin,
    typeArguments: [],
    functionArguments: [
      params.description,
      params.name,
      params.uri,
      params.max_supply,
      params.royalty_percentage,
      params.pre_mint_amount,
      params.guaranteed_allowlist_addresses,
      params.guaranteed_allowlist_mint_limit_per_addr,
      params.guaranteed_allowlist_start_time,
      params.guaranteed_allowlist_end_time,
      params.guaranteed_allowlist_mint_fee_per_nft,
      params.fcfs_allowlist_addresses,
      params.fcfs_allowlist_mint_limit_per_addr,
      params.fcfs_allowlist_start_time,
      params.fcfs_allowlist_end_time,
      params.fcfs_allowlist_mint_fee_per_nft,
      params.public_mint_start_time,
      params.public_mint_end_time,
      params.public_mint_limit_per_addr,
      params.public_mint_fee_per_nft,
    ],
  })) as UserTransactionResponse;

  console.log(response);
}

async function setupAllowlist(collectionId: `0x${string}`) {
  const whitelist = fs.readFileSync(path.join(__dirname, "../../../allowlist/fcfs_allowlist.csv"), "utf-8");
  const allowlist = fs.readFileSync(path.join(__dirname, "../../../allowlist/allowlist.csv"), "utf-8");

  const whitelistRows = whitelist
    .split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split(","));
  const allowlistRows = allowlist
    .split("\n")
    .filter(line => line.length > 0)
    .map(line => line.split(","));

  const whitelistAddresses = whitelistRows.map(row => row[0] as `0x${string}`);
  const whitelistMintLimitPerAddr = whitelistRows.map(row => row[1]);
  const allowlistAddresses = allowlistRows.map(row => row[0] as `0x${string}`);
  const allowlistMintLimitPerAddr = allowlistRows.map(row => row[1]);

  console.log(whitelistAddresses);
  console.log(whitelistMintLimitPerAddr);
  console.log(allowlistAddresses);
  console.log(allowlistMintLimitPerAddr);

  const whitelistResponse = await launchpadClient.entry.update_allowlist({
    account: admin,
    typeArguments: [],
    functionArguments: [collectionId, "Guaranteed allowlist mint stage", whitelistAddresses, whitelistMintLimitPerAddr],
  });
  console.log(whitelistResponse);

  const allowlistResponse = await launchpadClient.entry.update_allowlist({
    account: admin,
    typeArguments: [],
    functionArguments: [collectionId, "FCFS allowlist mint stage", allowlistAddresses, allowlistMintLimitPerAddr],
  });
  console.log(allowlistResponse);
}

async function reveal(collectionId: `0x${string}`) {
  const maxSupply = 1;
  const startNftIndex = 1;
  const endNftIndex = maxSupply;

  const tokens = (await aptosClient.queryIndexer({
    query: {
      query: `query getNFTs($collectionId: String) {
        current_token_datas_v2(where: { collection_id: { _eq: $collectionId } }) {
          token_data_id
          token_name
        }
      }
      `,
      variables: {
        collectionId,
      },
    },
  })) as any;

  for (let i = startNftIndex; i <= endNftIndex; i++) {
    const tokenId = tokens.current_token_datas_v2[i - 1].token_data_id;
    const json = JSON.parse(fs.readFileSync(`../../example-collection/metadatas/${i}.json`, "utf-8"));

    const propNames = json.attributes.map((attr: any) => attr.trait_type);
    const propValues = json.attributes.map((attr: any) => attr.value);

    console.log(json);

    const response = (await launchpadClient.entry.reveal_nft({
      typeArguments: [],
      functionArguments: [collectionId, tokenId, json.name, json.description, json.image, propNames, propValues],
      account: admin,
    })) as UserTransactionResponse;

    console.log(`revealed ${i} of ${maxSupply}`);
  }
}

main();
