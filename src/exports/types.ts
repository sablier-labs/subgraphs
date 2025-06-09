import type { Sablier } from "@sablier/deployments";

export namespace Indexer {
  /* -------------------------------------------------------------------------- */
  /*                                    TYPES                                   */
  /* -------------------------------------------------------------------------- */
  type BaseIndexer = {
    chainId: number;
    protocol: Protocol;
  };

  export type Envio = BaseIndexer & {
    envio: string;
  };

  export type Graph = BaseIndexer & (Graph.Custom | Graph.Official);

  export type Protocol = Exclude<Sablier.Protocol, "legacy">;

  export type Vendor = "envio" | "graph";

  /* -------------------------------------------------------------------------- */
  /*                               SUB-NAMESPACES                               */
  /* -------------------------------------------------------------------------- */
  export namespace Envio {
    export type Chain = {
      hypersync?: string;
      id: number;
    };
  }
  export namespace Graph {
    export type Chain = {
      name: string;
      id: number;
    };

    type Base = {
      kind: "custom" | "official";
    };

    export type Custom = Base & {
      kind: "custom";
      subgraph: {
        url: string;
      };
    };

    export type Official = Base & {
      explorerURL: string;
      kind: "official";
      playgroundURL: string;
      subgraph: {
        id: string;
        url: string;
      };
    };
  }
}
