# 🏗 Scaffold-Move

<div align="center">

![logo](/assets/logo_small.png)
<h4 align="center">
  <a href="https://github.com/arjanjohan/scaffold-move">Documentation</a> |
  <a href="https://scaffold-move-chi.vercel.app/">Website</a>
</h4>
</div>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on Move blockchains like Aptos and Movement M1. It's designed to make it easier for developers to create and deploy Move modules and build user interfaces that interact with those modules.

⚙️ Built using NextJS, Tailwind and Typescript.

- ✅ **Module Hot Reload**: Your frontend auto-adapts to your Move modules as you edit it.
- 🪝 **Custom hooks**: Collection of React hooks to simplify interactions with Move modules .
- 🧱 **Components**: Collection of common web3 components to quickly build your frontend.
- 🔐 **Integration with Wallet Providers**: Connect your Petra Wallet and interact with the Aptos or Movement M1 network.

![Debug Modules tab](assets/debug.png)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Movement CLI](https://aptos.dev/en/build/cli)

## Quickstart

To get started with Scaffold-Move, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/arjanjohan/scaffold-move.git
cd scaffold-move
yarn install
```

2. ~~Run a local network in  the first terminal:~~

<!-- ```
yarn chain
``` -->

Movement M1 devnet is hardcoded in this version of Scaffold-Move, so we skip this step.

3. On a second terminal, initialize a new account.

```
yarn account
```

This command overwrites `packages/move/.aptos/config.yaml` with a new Aptos account. The new address is copied over to the first address in the Move.toml file. If no address exists in this file, it is added on a new line.

4. Deploy the test modules:

```
yarn deploy
```

This command deploys the move modules to the selected network. The modules are located in `packages/move/sources` and can be modified to suit your needs. The `yarn deploy` command uses `aptos move publish` to publish the modules to the network. After this is executes the script located in `scripts/loadContracts.js` to make the new modules available in the nextjs frontend.

5. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your Move modules using the `Debug Modules` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

**What's next**:

- Edit your Move module `OnchainBio.move` in `packages/move/sources`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
<!-- - Edit your Move modules test in: `packages/hardhat/test`. To run test use `yarn hardhat:test` -->

## Next steps

For this hackathon I kept the scope small due to the time constraints. I build the most essential and useful features, so that developers can start using Scaffold Move right away. However, there are more features that I want to add to this project after the hackathon. If you have any ideas or suggestions, please reach out to me!

- Debug page
  - Styling Resources tab
  - Fix Vercel bug with Resources tab (Resources only showing on local for now)
  - Group modules under address
- Fix colors for dark mode
- Ensure export default deployedModules satisfies GenericContractsDeclaration
- Add block explorer page

## Links

- [Demo video](https://www.loom.com/share/4491aa1f222e409782a5ede3a7ac5cb0)
- [Website](https://scaffold-move-chi.vercel.app/)
- [Dorahacks](https://dorahacks.io/buidl/13953)
- [Github](https://github.com/arjanjohan/scaffold-move)

## Team

- [arjanjohan](https://x.com/arjanjohan/)
