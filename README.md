![Sablier Branding](./banner.png)

# Sablier Indexers 🚀

Data indexers for [Sablier](https://sablier.com) protocol for onchain token distribution. The indexers monitor Sablier's
smart contract events and transform them into structured, queryable data via GraphQL. The data is used to power the
[Sablier Interface](https://app.sablier.com).

We support two indexing vendors: [The Graph](https://thegraph.com) and [Envio](https://envio.dev).

## Documentation 📚

In-depth documentation is available at [docs.sablier.com](https://docs.sablier.com/api/overview). We provide a separate
indexer for each protocol:

- [Sablier Airdrops](https://docs.sablier.com/api/airdrops/indexers) - Airdrop distribution data
- [Sablier Flow](https://docs.sablier.com/api/flow/indexers) - Payment streams data
- [Sablier Lockup](https://docs.sablier.com/api/lockup/indexers) - Vesting streams data

## Contributing 🤝

Feel free to dive in! [Open](../../issues/new) an issue, [start](../../discussions/new) a discussion, or submit a PR.
For any informal concerns or feedback, please join our [Discord server](https://discord.gg/bSwRCwWRsT).

### Pre Requisites 🧰

You will need the following software on your machine:

- [Git](https://git-scm.com/downloads)
- [Just](https://github.com/casey/just)
- [Node.Js](https://nodejs.org/en/download)
- [Pnpm](https://pnpm.io)
- [Docker](https://docker.com)

### Set Up ⚙️

Clone this repository:

```shell
$ git clone git@github.com:sablier-labs/indexers.git && cd indexers
```

Then, run this command to install the Node.js dependencies:

```shell
$ just install
```

And run the setup recipe:

```shell
$ just setup
```

Now you can start making changes.

To see a list of all available scripts, run this command:

```shell
$ just --list
```

## License 📄

This repo is licensed under GPL 3-0 or later.
