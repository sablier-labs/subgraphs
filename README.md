![Sablier Branding](/assets/banner-subgraphs.png)

# Sablier Indexers

A collection of EVM data indexers for the Sablier Protocol.

These indexers serve as the backbone for the [Sablier Interface](https://app.sablier.com), providing real-time data
access and analytics capabilities.

## Documentation

In-depth documentation is available at [docs.sablier.com](https://docs.sablier.com/api/overview). Our indexers are
categorized into three main components:

- [Lockup Indexers](https://docs.sablier.com/api/lockup/indexers) - Track and analyze lockup contract data
- [Flow Indexers](https://docs.sablier.com/api/flow/indexers) - Monitor streaming payment flows
- [Merkle Indexers](https://docs.sablier.com/api/airdrops/indexers) - Manage airdrop distribution data

## For contributors

### Adding a new chain

TODO

Create a dedicated configuration, and add it in the [Envio bundles](./constants/src/bundles/) and provide a deployment
script for the subgraphs.

## License

This repo is licensed under GPL 3-0 or later.
