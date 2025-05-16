import type { Sablier } from "@sablier/deployments";
import type { ComponentMap } from "@src/types";

export type ABIEntriesMap = ComponentMap<Manifest.ABI[]>;
export type EntitiesMap = ComponentMap<string[]>;
export type EventHandlersMap = ComponentMap<Manifest.EventHandler[]>;

/**
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/
 */
export namespace Manifest {
  export interface ABI {
    name: string;
    file: string;
  }

  export namespace ContextItem {
    export interface Address {
      data: Sablier.Address;
      type: "String";
    }

    export interface BigInt {
      data: number;
      type: "BigInt";
    }
    export interface List<T> {
      data: T[];
      type: "List";
    }
    export type ListAddress = List<Address>;

    export interface String {
      data: string;
      type: "String";
    }
  }
  export interface Context {
    alias: ContextItem.String;
    chainId: ContextItem.BigInt;
    version: ContextItem.String;
    lockups?: ContextItem.ListAddress;
  }

  export interface EventHandler {
    /** Event signature without parameter names. */
    event: string;
    handler: `handle${string}`;
  }

  export interface Source {
    kind: string;
    name: string;
    network: string;
    /** Undefined when it's a template. */
    context?: Context;
    source: {
      abi: string;
      /** Undefined when it's a template. */
      address?: Sablier.Address;
      /** Undefined when it's a template. */
      startBlock?: number;
    };
    mapping: Mapping;
    /** Will not be included in the manifest. */
    _type?: "data-source" | "template";
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

  /**
   * This will be inlined. There will not be a `topSection` key in the manifest.
   */
  export interface TopSection {
    specVersion: string;
    description: string;
    repository: string;
    schema: {
      file: string;
    };
    dataSources: Source[];
    templates?: Source[];
  }
}
