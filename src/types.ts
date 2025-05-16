/**
 * Types needed for all indexers: Envio and The Graph.
 */
import type { Sablier } from "@sablier/deployments";

export interface ComponentMap<T> {
  [contractName: string]: {
    [version: string]: T;
  };
}

export type IndexedContractList<V extends Sablier.Version> = Array<{
  name: string;
  isTemplate: boolean;
  versions: V[];
}>;

/**
 * Represents an event emitted by a Sablier contract that is tracked and processed by our indexers.
 * This interface defines the metadata needed to identify and handle specific contract events
 * across different versions and protocols.
 */
export interface IndexedEvent {
  /** Name of contract whose ABI contains the event, e.g., SablierLockup. */
  contractName: string;
  /** Needed to differentiate between multiple handlers for the same event. */
  handlerSuffix?: string;
  /** Event name, e.g., Approval. */
  eventName: string;
  /** Protocol of contract, e.g., flow. */
  protocol?: IndexedProtocol;
  /** Version of contract, e.g., v1.0. */
  version?: Sablier.Version;
}

export type IndexedEventMap = ComponentMap<IndexedEvent[]>;

/**
 * The Legacy protocol is not indexed.
 */
export type IndexedProtocol = Exclude<Sablier.Protocol, "legacy">;

export type ProtocolMap<T> = {
  [protocol in IndexedProtocol]: T;
};
