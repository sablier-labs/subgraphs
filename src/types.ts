export namespace Config {
  export type Contracts<V extends string> = Array<{
    contractName: string;
    isTemplate: boolean;
    versions: V[];
  }>;

  interface ComponentMap<T> {
    [protocol: string]: {
      [contractName: string]: {
        [version: string]: T;
      };
    };
  }

  export type ABIEntries = ComponentMap<Manifest.ABI[]>;
  export type Entities = ComponentMap<string[]>;
  export type EventHandlers = ComponentMap<Manifest.EventHandler[]>;
}

export namespace Manifest {
  export interface ABI {
    name: string;
    file: string;
  }

  /** @see https://thegraph.com/docs/en/subgraphs/developing/creating/graph-ts/api/#datasourcecontext-in-manifest */
  export namespace ContextItem {
    export interface BigInt {
      data: number;
      type: "BigInt";
    }
    export interface List<T> {
      data: T[];
      type: "List";
    }
    export type ListString = List<String>;

    export interface String {
      data: string;
      type: "String";
    }
  }
  export interface Context {
    alias: ContextItem.String;
    chainId: ContextItem.BigInt;
    version: ContextItem.String;
    lockups?: ContextItem.ListString;
  }

  export interface Source {
    kind: string;
    name: string;
    network: string;
    context?: Context; // Undefined when it's a template
    source: {
      abi: string;
      address?: string; // Undefined when it's a template
      startBlock?: number; // Undefined when it's a template
    };
    mapping: Mapping;
    type: "data-source" | "template";
  }

  export interface EventHandler {
    event: string;
    handler: `handle${string}`;
  }

  export interface Mapping {
    apiVersion: string;
    file: string;
    kind: string;
    language: string;
    abis: ABI[];
    entities: string[];
    eventHandlers: EventHandler[];
  }

  export interface TopConfig {
    specVersion: string;
    description: string;
    repository: string;
    schema: {
      file: string;
    };
    dataSources?: Source[];
    templates?: Source[];
  }
}
