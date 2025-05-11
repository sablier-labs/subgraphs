export namespace Config {
  export type ContractList<V extends string> = Array<{
    contractName: string;
    versions: V[];
  }>;

  export namespace Map {
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
}

/** @see {@link ./graph/flow/manifests/*.yaml} */
export namespace Manifest {
  export interface ABI {
    name: string;
    file: string;
  }

  export interface Context {
    alias: {
      data: string;
      type: "String";
    };
    chainId: {
      data: number;
      type: "BigInt";
    };
    version: {
      data: string;
      type: "String";
    };
  }

  export interface DataSource {
    kind: string;
    name: string;
    network: string;
    context: Context;
    source: Source;
    mapping: Mapping;
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

  export interface Source {
    address: string;
    abi: string;
    startBlock: number;
  }

  export interface TopConfig {
    specVersion: string;
    description: string;
    repository: string;
    schema: {
      file: string;
    };
    dataSources: DataSource[];
  }
}
