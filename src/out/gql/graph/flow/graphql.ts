/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
};

/** A generic entity for tracking protocol actions. There may be multiple actions for a single tx. */
export type Action = {
  __typename?: 'Action';
  /** Address of 1st actor. Who this is depends upon the action type, e.g. for Create, it is the sender. */
  addressA?: Maybe<Scalars['Bytes']['output']>;
  /** Address of 2nd actor. Who this is depends upon the action type, e.g. for Transfer, it is the recipient. */
  addressB?: Maybe<Scalars['Bytes']['output']>;
  /** 1st amount. What this is depends upon the action type, e.g. for Deposit, it is the deposit amount. */
  amountA?: Maybe<Scalars['BigInt']['output']>;
  /** 2nd amount. What this is depends upon the action type, e.g. for Withdraw, it is the refund amount. */
  amountB?: Maybe<Scalars['BigInt']['output']>;
  /** Block number of the Ethereum transaction. */
  block: Scalars['BigInt']['output'];
  /** Category of action, e.g., Deposit. */
  category: ActionCategory;
  /** The id of the chain, e.g. 137 for Polygon. */
  chainId: Scalars['BigInt']['output'];
  /** Contract through which the action was triggered. */
  contract: Scalars['Bytes']['output'];
  /**
   * The Sablier fee paid in the native token of the chain, e.g., ETH for Ethereum Mainnet.
   * See https://docs.sablier.com/concepts/fees
   */
  fee?: Maybe<Scalars['BigInt']['output']>;
  /** The msg.sender of the Ethereum transaction. */
  from: Scalars['Bytes']['output'];
  /** Hash of the Ethereum transaction. */
  hash: Scalars['Bytes']['output'];
  /** Unique identifier: {txHash}-{blockLogIndex} */
  id: Scalars['String']['output'];
  /** Stream linked to this action, if any. */
  stream?: Maybe<Stream>;
  /** Unique global id as tracked by the `Watcher` entity. */
  subgraphId: Scalars['BigInt']['output'];
  /** Unix timestamp of the Ethereum transaction. */
  timestamp: Scalars['BigInt']['output'];
};

export enum ActionCategory {
  Adjust = 'Adjust',
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
  Create = 'Create',
  Deposit = 'Deposit',
  Pause = 'Pause',
  Refund = 'Refund',
  Restart = 'Restart',
  Transfer = 'Transfer',
  Void = 'Void',
  Withdraw = 'Withdraw'
}

/** ERC-20 asset */
export type Asset = {
  __typename?: 'Asset';
  /** Alias for id */
  address: Scalars['Bytes']['output'];
  /** The id of the chain, e.g. 137 for Polygon */
  chainId: Scalars['BigInt']['output'];
  /** Decimals of the ERC20 token */
  decimals: Scalars['BigInt']['output'];
  /** Contract address of the ERC20 token */
  id: Scalars['ID']['output'];
  /** Name of the ERC20 token */
  name: Scalars['String']['output'];
  /** Streams that rely on this token */
  streams: Array<Stream>;
  /** Symbol of the ERC20 token */
  symbol: Scalars['String']['output'];
};

/**
 * Creating streams in bulk is possible using the SablierBatchLockup contract.
 * See https://github.com/sablier-labs/lockup/blob/v2.0.1/src/SablierBatchLockup.sol
 *
 * The entity can be immutable because a batch is only updated in the same block.
 * See https://thegraph.com/docs/en/subgraphs/developing/creating/ql-schema/#defining-entities
 */
export type Batch = {
  __typename?: 'Batch';
  /** The sender address that created this batch. */
  batcher?: Maybe<Batcher>;
  /** Hash of the Ethereum transaction that created this batch. */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** Unique identifier: {chainId}-{txHash}-{batcher} */
  id: Scalars['String']['output'];
  /** Number of streams part of this batch. */
  size: Scalars['BigInt']['output'];
  /** Streams part of this batch. */
  streams: Array<Stream>;
  /** Timestamp of the transaction that created this batch. */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

/** Sender address that created batches. */
export type Batcher = {
  __typename?: 'Batcher';
  /** Numerical index. */
  batchCounter: Scalars['BigInt']['output'];
  /** Batches started by this sender. */
  batches: Array<Batch>;
  /** Unique identifier: {chainId}-{sender} */
  id: Scalars['String']['output'];
};

export type Stream = {
  __typename?: 'Stream';
  /** Actions triggered by this stream. */
  actions: Array<Action>;
  /** Like the id: {contractAlias}-{chainId}-{tokenId} */
  alias: Scalars['String']['output'];
  /** ERC-20 token distributed via this stream. */
  asset: Asset;
  /** ERC-20 token decimals. Stored here to avoid loading the asset entity on each stream. */
  assetDecimals: Scalars['BigInt']['output'];
  /** This is equivalent to the value returned by ERC20.balanceOf, and it changes after deposit and withdrawal. */
  availableAmount: Scalars['BigInt']['output'];
  /**
   * The batch the stream may be part of.
   * Note: this is available only when created within a batch create transaction.
   */
  batch: Batch;
  /** Category used for sorting. */
  category: StreamCategory;
  /** The id of the chain, e.g., 137 for Polygon. */
  chainId: Scalars['BigInt']['output'];
  /** The contract the stream originates from. */
  contract: Scalars['Bytes']['output'];
  /** The account that created the stream, which can be different from the sender. */
  creator: Scalars['Bytes']['output'];
  /** Unix timestamp indicating the time when the stream will become insolvent. */
  depletionTime: Scalars['BigInt']['output'];
  /** The sum of all deposits. */
  depositedAmount: Scalars['BigInt']['output'];
  /** The amount of debt forgiven by a void action. */
  forgivenDebt: Scalars['BigInt']['output'];
  /** Hash of the Ethereum transaction that created this stream. */
  hash: Scalars['Bytes']['output'];
  /** Unique identifier: {contractAddress}-{chainId}-{tokenId} */
  id: Scalars['String']['output'];
  /** Action in which the payment rate was adjusted. */
  lastAdjustmentAction?: Maybe<Action>;
  /** Unix timestamp for when the payment rate was adjusted. */
  lastAdjustmentTimestamp: Scalars['BigInt']['output'];
  /** Flag indicating if a stream is paused. */
  paused: Scalars['Boolean']['output'];
  /** Action in which the stream was paused. */
  pausedAction?: Maybe<Action>;
  /** Unix timestamp for when the stream was paused. */
  pausedTime?: Maybe<Scalars['BigInt']['output']>;
  /** Position in the batch, if available. */
  position: Scalars['BigInt']['output'];
  /** Current payment rate per second, denominated in 18 decimals. */
  ratePerSecond: Scalars['BigInt']['output'];
  /**
   * Current recipient of the stream, with permission to withdraw funds to any third-party address.
   * Note: the recipient can change on NFT transfer.
   */
  recipient: Scalars['Bytes']['output'];
  /** The sum of all refunds. */
  refundedAmount: Scalars['BigInt']['output'];
  /** Manager of the stream, with ability to cancel the stream. */
  sender: Scalars['Bytes']['output'];
  /** The amount streamed up until the time of the last adjustment, denominated in 18 decimals. */
  snapshotAmount: Scalars['BigInt']['output'];
  /** Unix timestamp for the start of the stream. */
  startTime: Scalars['BigInt']['output'];
  /**
   * Unique global id as tracked by the `Watcher` entity.
   * 🚨 This may change if new data sources are added and the chronological order of streams changes.
   */
  subgraphId: Scalars['BigInt']['output'];
  /** Unix timestamp of the Ethereum transaction that created this stream. */
  timestamp: Scalars['BigInt']['output'];
  /** The id provided by the Lockup contract. This is the ERC-721 tokenId. */
  tokenId: Scalars['BigInt']['output'];
  /**
   * Flag indicating the transferability of the stream. This is set when the stream is created, and cannot
   * be changed later.
   */
  transferable: Scalars['Boolean']['output'];
  /** Version of contract, e.g., v1.0. */
  version: Scalars['String']['output'];
  /** Flag indicating if a stream is voided. */
  voided: Scalars['Boolean']['output'];
  /** Action in which the stream was voided. */
  voidedAction?: Maybe<Action>;
  /** Unix timestamp for when the stream was voided. */
  voidedTime?: Maybe<Scalars['BigInt']['output']>;
  /** The sum of all withdrawn amounts. */
  withdrawnAmount: Scalars['BigInt']['output'];
};

export enum StreamCategory {
  Flow = 'Flow'
}

export type Watcher = {
  __typename?: 'Watcher';
  /** Global counter for actions. */
  actionCounter: Scalars['BigInt']['output'];
  /** Alias for id. */
  chainId: Scalars['BigInt']['output'];
  /** The chain ID. There is one watcher per subgraph. */
  id: Scalars['String']['output'];
  /** Used for debugging purposes. They are normally empty. */
  logs?: Maybe<Array<Scalars['String']['output']>>;
  /** Global counter. */
  streamCounter: Scalars['BigInt']['output'];
};

export type ActionFragmentFragment = { __typename?: 'Action', id: string, addressA?: any | null, addressB?: any | null, amountA?: any | null, amountB?: any | null, contract: any, block: any, category: ActionCategory, chainId: any, from: any, hash: any, subgraphId: any, timestamp: any, stream?: { __typename?: 'Stream', id: string } | null };

export type AssetFragmentFragment = { __typename?: 'Asset', id: string, address: any, chainId: any, decimals: any, name: string, symbol: string };

export type BatchFragmentFragment = { __typename?: 'Batch', id: string, hash?: any | null, size: any };

export type StreamFragmentFragment = { __typename?: 'Stream', id: string, alias: string, availableAmount: any, category: StreamCategory, chainId: any, contract: any, creator: any, depletionTime: any, depositedAmount: any, forgivenDebt: any, hash: any, lastAdjustmentTimestamp: any, paused: boolean, pausedTime?: any | null, position: any, ratePerSecond: any, recipient: any, refundedAmount: any, sender: any, snapshotAmount: any, startTime: any, subgraphId: any, timestamp: any, tokenId: any, transferable: boolean, version: string, voided: boolean, voidedTime?: any | null, withdrawnAmount: any, asset: { __typename?: 'Asset', id: string, address: any, chainId: any, decimals: any, name: string, symbol: string }, batch: { __typename?: 'Batch', id: string, hash?: any | null, size: any } };

export const ActionFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"addressA"}},{"kind":"Field","name":{"kind":"Name","value":"addressB"}},{"kind":"Field","name":{"kind":"Name","value":"amountA"}},{"kind":"Field","name":{"kind":"Name","value":"amountB"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"block"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"subgraphId"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"stream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ActionFragmentFragment, unknown>;
export const AssetFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]} as unknown as DocumentNode<AssetFragmentFragment, unknown>;
export const BatchFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BatchFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Batch"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]} as unknown as DocumentNode<BatchFragmentFragment, unknown>;
export const StreamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StreamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Stream"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"availableAmount"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"contract"}},{"kind":"Field","name":{"kind":"Name","value":"creator"}},{"kind":"Field","name":{"kind":"Name","value":"depletionTime"}},{"kind":"Field","name":{"kind":"Name","value":"depositedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"forgivenDebt"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"lastAdjustmentTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"paused"}},{"kind":"Field","name":{"kind":"Name","value":"pausedTime"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"ratePerSecond"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"refundedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"sender"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotAmount"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"subgraphId"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"voided"}},{"kind":"Field","name":{"kind":"Name","value":"voidedTime"}},{"kind":"Field","name":{"kind":"Name","value":"withdrawnAmount"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AssetFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"batch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BatchFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AssetFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BatchFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Batch"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]} as unknown as DocumentNode<StreamFragmentFragment, unknown>;