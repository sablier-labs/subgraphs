import type { Sablier } from "@sablier/deployments";

export namespace Indexer {
  type Common = {
    chainId: number;
    protocol: Protocol;
  };

  export namespace Envio {
    export type Chain = SupportedChain & {
      envio: { isEnabled: boolean; hypersync?: string };
      graph: never;
    };
  }

  export type Envio = Common & {
    envio: string;
  };

  export type Protocol = Exclude<Sablier.Protocol, "legacy">;

  export namespace Graph {
    export type Chain = SupportedChain & {
      envio: never;
      graph: { isEnabled: boolean; name: string };
    };

    type SubgraphCommon = {
      /** URL to The Graph explorer. */
      explorerURL?: string;
      /** The kind of subgraph. */
      kind: "custom" | "official";
      /** URL to The Graph studio. */
      studioURL?: string;
    };

    export type SubgraphCustom = SubgraphCommon & {
      kind: "custom";
      subgraphURL: string;
      subgraph?: never;
    };

    export type SubgraphOfficial = SubgraphCommon & {
      kind: "official";
      subgraphURL?: never;
      subgraph: {
        id: string;
        url: string;
      };
    };

    export type Subgraph = SubgraphCustom | SubgraphOfficial;
  }

  export type Graph = Common & {
    graph: Graph.Subgraph;
  };

  export type SupportedChain = {
    id: number;
    envio?: { isEnabled: boolean; hypersync?: string };
    graph?: { isEnabled: boolean; name: string };
  };

  export type Vendor = "envio" | "graph";
}
