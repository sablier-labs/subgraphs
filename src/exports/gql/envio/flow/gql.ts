/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment ActionFragment on Action {\n    id\n    addressA\n    addressB\n    amountA\n    amountB\n    block\n    category\n    chainId\n    contract\n    from\n    hash\n    subgraphId\n    timestamp\n    stream {\n      id\n    }\n  }\n": typeof types.ActionFragmentFragmentDoc,
    "\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n": typeof types.AssetFragmentFragmentDoc,
    "\n  fragment BatchFragment on Batch {\n    id\n    hash\n    position\n    size\n  }\n": typeof types.BatchFragmentFragmentDoc,
    "\n    fragment StreamFragment on Stream {\n      id\n      alias\n      availableAmount\n      category\n      chainId\n      creator\n      contract\n      depletionTime\n      depositedAmount\n      forgivenDebt\n      hash\n      lastAdjustmentTimestamp\n      paused\n      pausedTime\n      position\n      ratePerSecond\n      recipient\n      refundedAmount\n      sender\n      snapshotAmount\n      startTime\n      subgraphId\n      timestamp\n      tokenId\n      transferable\n      version\n      voided\n      voidedTime\n      withdrawnAmount\n      asset {\n        ...AssetFragment\n      }\n      batch {\n        ...BatchFragment\n      }\n    }\n  ": typeof types.StreamFragmentFragmentDoc,
};
const documents: Documents = {
    "\n  fragment ActionFragment on Action {\n    id\n    addressA\n    addressB\n    amountA\n    amountB\n    block\n    category\n    chainId\n    contract\n    from\n    hash\n    subgraphId\n    timestamp\n    stream {\n      id\n    }\n  }\n": types.ActionFragmentFragmentDoc,
    "\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n": types.AssetFragmentFragmentDoc,
    "\n  fragment BatchFragment on Batch {\n    id\n    hash\n    position\n    size\n  }\n": types.BatchFragmentFragmentDoc,
    "\n    fragment StreamFragment on Stream {\n      id\n      alias\n      availableAmount\n      category\n      chainId\n      creator\n      contract\n      depletionTime\n      depositedAmount\n      forgivenDebt\n      hash\n      lastAdjustmentTimestamp\n      paused\n      pausedTime\n      position\n      ratePerSecond\n      recipient\n      refundedAmount\n      sender\n      snapshotAmount\n      startTime\n      subgraphId\n      timestamp\n      tokenId\n      transferable\n      version\n      voided\n      voidedTime\n      withdrawnAmount\n      asset {\n        ...AssetFragment\n      }\n      batch {\n        ...BatchFragment\n      }\n    }\n  ": types.StreamFragmentFragmentDoc,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ActionFragment on Action {\n    id\n    addressA\n    addressB\n    amountA\n    amountB\n    block\n    category\n    chainId\n    contract\n    from\n    hash\n    subgraphId\n    timestamp\n    stream {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment ActionFragment on Action {\n    id\n    addressA\n    addressB\n    amountA\n    amountB\n    block\n    category\n    chainId\n    contract\n    from\n    hash\n    subgraphId\n    timestamp\n    stream {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n"): (typeof documents)["\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment BatchFragment on Batch {\n    id\n    hash\n    position\n    size\n  }\n"): (typeof documents)["\n  fragment BatchFragment on Batch {\n    id\n    hash\n    position\n    size\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment StreamFragment on Stream {\n      id\n      alias\n      availableAmount\n      category\n      chainId\n      creator\n      contract\n      depletionTime\n      depositedAmount\n      forgivenDebt\n      hash\n      lastAdjustmentTimestamp\n      paused\n      pausedTime\n      position\n      ratePerSecond\n      recipient\n      refundedAmount\n      sender\n      snapshotAmount\n      startTime\n      subgraphId\n      timestamp\n      tokenId\n      transferable\n      version\n      voided\n      voidedTime\n      withdrawnAmount\n      asset {\n        ...AssetFragment\n      }\n      batch {\n        ...BatchFragment\n      }\n    }\n  "): (typeof documents)["\n    fragment StreamFragment on Stream {\n      id\n      alias\n      availableAmount\n      category\n      chainId\n      creator\n      contract\n      depletionTime\n      depositedAmount\n      forgivenDebt\n      hash\n      lastAdjustmentTimestamp\n      paused\n      pausedTime\n      position\n      ratePerSecond\n      recipient\n      refundedAmount\n      sender\n      snapshotAmount\n      startTime\n      subgraphId\n      timestamp\n      tokenId\n      transferable\n      version\n      voided\n      voidedTime\n      withdrawnAmount\n      asset {\n        ...AssetFragment\n      }\n      batch {\n        ...BatchFragment\n      }\n    }\n  "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;