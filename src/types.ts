export declare namespace Manifest {
  export interface ABI {
    name: string;
    file: string;
  }

  export interface Context {
    chainId: {
      data: number;
      type: string;
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
    handler: string;
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
