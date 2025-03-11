![Sablier Branding](/assets/banner-subgraphs.png)

# Sablier Subgraphs and Indexers

Sablier uses a combination of The Graph subgraphs and Envio indexers as a data API.

In-depth documentation is available at [docs.sablier.com](https://docs.sablier.com/api/overview). For the list of
endpoints, see [this](https://docs.sablier.com/api/lockup/endpoints).

## For contributors

### Adding a new chain

Create a dedicated configuration, and add it in the [Envio bundles](./packages/constants/src/bundles/) and provide a
deployment script for the subgraphs.

### Tracking a new address

See the [`constants`](./packages/constants) folder. Specify the chain, append the contract, and run the codegen steps to
make sure everything runs smoothly.

### Corepack

Some versions of Node.js may enforce the usage of [corepack](https://nodejs.org/api/corepack.html). Because this
repository leverages both `yarn` (for the root workspace and in the Graph packages) and `pnpm` (for Envio), Node.js may
throw a warning due a missing **exact** `packageManager` entry for `pnpm`. However, this entry should not be added
because it will mess with Envio's hosted service. We suggest
[disabling Corepack](https://stackoverflow.com/a/78822612/3873510) to avoid the warning.

## License

This repo is licensed under GPL 3-0 or later.
