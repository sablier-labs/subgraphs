/**
 * Types needed for all indexers: Envio and The Graph.
 */
import type { Sablier } from "@sablier/deployments";

export type ComponentMap<T> = {
  [contractName: string]: {
    [version: string]: T;
  };
};

export type ProtocolMap<T> = {
  [protocol in Indexed.Protocol]: T;
};

export namespace Indexed {
  /**
   * A variation of the Sablier.Contract type that is used to index contracts. The `alias` is required.
   * @see Sablier.Contract
   */
  export type Contract = {
    /** Address of the contract - MUST be provided in lowercase. */
    address: string;
    /** MUST be provided. */
    alias: string;
    block: number;
    name: string;
    protocol: Protocol;
    version: Version;
  };

  export type ContractSource<V extends Version> = {
    /** The name of the contract, e.g., SablierFlow. */
    name: string;
    /** Whether the contract is a template, i.e., deployed by a factory. */
    isTemplate: boolean;
    /** The Sablier versions the contract is part of. */
    versions: V[];
  };

  /**
   * Event emitted by a Sablier contract that is tracked and processed by our indexers.
   * This type defines the metadata needed to identify and handle specific contract events
   * across different versions and protocols.
   */
  export type Event = {
    /** Name of contract whose ABI contains the event, e.g., SablierLockup. */
    contractName: string;
    /** Needed to differentiate between multiple handlers for the same event. */
    handlerSuffix?: string;
    /** Event name, e.g., Approval. */
    eventName: string;
    /** Protocol of contract, e.g., flow. */
    protocol?: Protocol;
    /** Version of contract, e.g., v1.0. */
    version?: Version;
  };

  export type EventMap = ComponentMap<Event[]>;

  /**
   * The Legacy protocol is not indexed.
   */
  export type Protocol = Exclude<Sablier.Protocol, "legacy">;

  export type Vendor = "envio" | "graph";

  export type Version = Sablier.Version.Airdrops | Sablier.Version.Flow | Sablier.Version.Lockup;
}
