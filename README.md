![Sablier Branding](/assets/banner-subgraphs.png)

# Sablier Indexers

A collection of EVM data indexers for the Sablier Protocol.

These indexers serve as the backbone for the [Sablier Interface](https://app.sablier.com), providing real-time data
access and analytics capabilities.

## Documentation

In-depth documentation is available at [docs.sablier.com](https://docs.sablier.com/api/overview). Our indexers are
categorized into three main components:

- [Airdrops Indexers](https://docs.sablier.com/api/airdrops/indexers) - Airdrop distribution data
- [Flow Indexers](https://docs.sablier.com/api/flow/indexers) - Payment streams data
- [Lockup Indexers](https://docs.sablier.com/api/lockup/indexers) - Vesting streams data

## Contributing

Feel free to dive in! [Open](../../issues/new) an issue, [start](../../discussions/new) a discussion or submit a PR. For
any informal concerns or feedback, please join our [Discord server](https://discord.gg/bSwRCwWRsT).

## Pre Requisites

You will need the following software on your machine:

- [Git](https://git-scm.com/downloads)
- [Node.Js](https://nodejs.org/en/download)
- [Bun](https://bun.sh)
- [Just](https://github.com/casey/just)

For running the tests for The Graph, you will need:

- [PostgreSQL](https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#install-postgresql)

## Set Up

Clone this repository:

```shell
$ git clone git@github.com:sablier-labs/indexers.git && cd indexers
```

Then, run this to install the Node.js dependencies and build the contracts:

```shell
$ bun install
```

Now you can start making changes.

To see a list of all available scripts:

```shell
$ bun run
```

## License

This repo is licensed under GPL 3-0 or later.
