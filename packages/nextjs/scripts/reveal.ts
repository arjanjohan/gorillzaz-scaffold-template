import deployedModules from "../modules/deployedModules";
import { getSigner } from "./aptos-helper";
import { parseYaml } from "./helper";
import { getAptosClient } from "./movement-client";
import { UserTransactionResponse } from "@aptos-labs/ts-sdk";
import { createSurfClient } from "@thalalabs/surf";
import { Network } from "aptos";
import fs from "fs";
import path from "path";

const configYamlPath = path.join(__dirname, "../../move/.aptos/config.yaml");

const config = parseYaml(configYamlPath) as any;
const nodeUrl = config.profiles.default.rest_url;
const accountAddress = config.profiles.default.account.replace(/^0x/, ""); // Strip 0x from the account address

const admin = getSigner(configYamlPath);
const { aptosClient } = getAptosClient(
  Network.TESTNET,
  nodeUrl,
  "https://api.testnet.staging.aptoslabs.com/v1/graphql",
);
const launchpadClient = createSurfClient(aptosClient).useABI(deployedModules[2].launchpad_double_whitelist.abi);

async function main() {
  await reveal();
}

async function reveal() {
  const maxSupply = 1;
  const startNftIndex = 1;
  const endNftIndex = maxSupply;
  const collectionId = "0x7d78fc0346f44cd77a47eb09a0e3d9c7bbf358c2d6fe8828d62d32abcb6c6b65";

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
