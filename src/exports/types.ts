import type { Sablier } from "@sablier/deployments";

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

  export type GraphConfig = {
    chainId: number;
    name: string;
  };

  export type Protocol = Exclude<Sablier.Protocol, "legacy">;

  export type SubgraphName = `sablier-${string}`;

  export type Vendor = "envio" | "graph";
}
