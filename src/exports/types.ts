import type { Sablier } from "sablier";

export type Indexer = {
  chainId: number;
  explorerURL?: string;
  endpoint: {
    id?: string;
    url: string;
  };
  kind: "custom" | "official";
  playgroundURL?: string;
  protocol: Indexer.Protocol;
  name: Indexer.SubgraphName;
};

export namespace Indexer {
  export type EnvioConfig = {
    chainId: number;
    hypersync?: string;
  };

  export type EnvioId = {
    /** Unix timestamp in seconds for when the indexer ID was created. */
    createdOn: number;
    /** The indexer ID value, e.g. `53b7e25`. */
    id: string;
    /** Whether the indexer ID is the latest one for the protocol. */
    isLatest: boolean;
    /** The protocol associated with this indexer. */
    protocol: Indexer.Protocol;
    /**
     * Unix timestamp in seconds for when the indexer ID was used last time in the Sablier Interface.
     * An undefined value means that the indexer ID is no longer used.
     */
    usedUntil?: number;
  };

  export type GraphConfig = {
    chainId: number;
    name: string;
  };

  export type Protocol = Exclude<Sablier.Protocol, "legacy">;

  export type SubgraphName = `sablier-${string}`;

  export type Vendor = "envio" | "graph";
}
