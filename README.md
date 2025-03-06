![Sablier Branding](/assets/banner-subgraphs.png)

# Sablier Subgraphs and Indexers

Sablier relies on specific dependencies to source data or manage off-chain flows. All of these are either public or
fully open-source, so feel free to roam around and suggest improvements or optimizations where needed.

As an alternative to reading data from the contracts or listening to onchain events, we use a set of subgraphs and
indexers. These act as a middleware between the chain and our interfaces and allow for caching, formatting and querying
data.

For every The Graph subgraph you will find a dedicated Envio indexer that mirrors its functionality and can be used as a
fallback or as a completely alternative query engine.

## The Graph Subgraphs

Read more about The Graph [here](https://thegraph.com/docs/en/).

Sablier supports multiple chains for which we've deployed subgraphs at either the Hosted Network level or within the
Decentralized Network (see Ethereum, Arbitrum or Polygon's endpoints).

Subgraphs are configured using `yarn`.

### Subgraph: Lockup

The **Lockup** subgraph watches over the core lockup functionality of Sablier. It handles events such as
`Create Stream`, `Withdraw` or `Transfer`.

[Documentation](https://docs.sablier.com/api/lockup/overview) and
[Endpoints](https://docs.sablier.com/api/lockup/endpoints).

### Subgraph: Merkle/Drops

The **Merkle** subgraph watches over the Merkle Lockup functionality from Sablier's periphery contracts. It handles
events such as `Create Campaign`, `Claim` or `Clawback`. In the client interfaces it is used to track activity for
Airdrops.

[Documentation](https://docs.sablier.com/api/drops/overview) and
[Endpoints](https://docs.sablier.com/api/drops/endpoints).

### Subgraph: Flow

The **Flow** subgraph watches over the core flow functionality of Sablier. It handles events such as `Create Stream`,
`Deposit` or `Adjust`.

[Documentation](https://docs.sablier.com/api/flow/overview) and
[Endpoints](https://docs.sablier.com/api/flow/endpoints).

---

## Envio Indexers

Read more about Envio [here](https://docs.envio.dev).

> [!IMPORTANT]
>
> When new addresses are added to an Envio indexer (through the shared package) run `pnpm run setup` or `pnpm run dev`
> to make sure the necessary files get generated.

Indexers are configured using `pnpm`.

### Indexer: Lockup-Envio

The **Lockup-Envio** indexer watches over the core lockup functionality of Sablier. It handles events such as
`Create Stream`, `Withdraw` or `Transfer`.

[Documentation](https://docs.sablier.com/api/lockup/overview) and
[Endpoints](https://docs.sablier.com/api/lockup/endpoints).

### Indexer: Merkle-Envio

The **Merkle-Envio** subgraph watches over the Merkle Lockup functionality from Sablier's periphery contracts. It
handles events such as `Create Campaign`, `Claim` or `Clawback`. In the client interfaces it is used to track activity
for Airdrops.

[Documentation](https://docs.sablier.com/api/drops/overview) and
[Endpoints](https://docs.sablier.com/api/drops/endpoints).

### Indexer: Flow-Envio

The **~Flow-Envio** indexer watches over the core flow functionality of Sablier. It handles events such as
`Create Stream`, `Deposit` or `Adjust`.

[Documentation](https://docs.sablier.com/api/lockup/overview) and
[Endpoints](https://docs.sablier.com/api/lockup/endpoints).

> [!TIP]
>
> To track new addresses see the [`constants`](./packages/constants) folder. Pick the chain, append a new contract and
> run the codegen steps to make sure everything runs smoothly. To add a new chain, create a dedicated configuration and
> make sure to (1) add it in the envio [bundles](./packages/constants/src/bundles/) (2) add a deployment script for
> subgraphs.

> [!IMPORTANT]
>
> Some versions of Node may enforce the usage of [corepack](https://nodejs.org/api/corepack.html). Because this
> repository leverages both `yarn` (root and the-graph) and `pnpm` (envio) it may scream due to a missing
> `packageManager` **exact** entry for `pnpm`. If added, it will mess with Envio's hosted service. Therefore, we advise
> [disabling corepack](https://stackoverflow.com/questions/78795659/how-to-disable-auto-setting-of-packagemanager-when-corepack-is-enabled#comment138977943_78822612)
> to avoid the warning. It looks like it's being [deprecated](https://www.youtube.com/watch?v=I7qMwaxNNOc) anyway.

<sub>Version Trigger: [26]</sub>
