NFT Template for minting, based on the aptos launchpad.move.

Launchpad has 2 allowlist stages and a public mint stage. 

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Aptos CLI](https://aptos.dev/en/build/cli)

## Quickstart

To get started with Scaffold Move, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/arjanjohan/scaffold-move.git
cd scaffold-move
yarn install
```

2. On a second terminal, initialize a new account.

```
yarn account
```

This command overwrites `packages/move/.aptos/config.yaml` with a new Aptos account. The new address is copied over to the first address in the Move.toml file. If no address exists in this file, it is added on a new line.

3. Deploy the launchpad module:

```
yarn deploy
```

This command deploys the move modules to the selected network. The modules are located in `packages/move/sources` and can be modified to suit your needs. The `yarn deploy` command uses `aptos move publish` to publish the modules to the network. After this is executes the script located in `scripts/loadModules.js` to make the new modules available in the nextjs frontend.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your Move modules using the `Debug Modules` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

5. Deploy to Vercel

After you made your changes and are happy with the app, it's time to publish it for the world. Use this command to deploy it to vercel:
```
yarn vercel
```
Follow the instructions on screen. Use `--prod` to deploy directly to production. If you want to deploy and ignore any warnings, use `yarn vercel:yolo` instead.