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
    "\n    fragment ActionFragment on Action {\n      id\n      block\n      category\n      chainId\n      claimAmount\n      claimIndex\n      claimRecipient\n      claimStreamId\n      claimTokenId\n      clawbackAmount\n      clawbackFrom\n      clawbackTo\n      fee\n      from\n      hash\n      subgraphId\n      timestamp\n      campaign {\n        id\n        name\n        nickname\n      }\n    }\n  ": typeof types.ActionFragmentFragmentDoc,
    "\n    fragment ActivityFragment on Activity {\n      id\n      amount\n      claims\n      day\n      timestamp\n      campaign {\n        id\n      }\n    }\n  ": typeof types.ActivityFragmentFragmentDoc,
    "\n    fragment CampaignFragmentBase on Campaign {\n      id\n      address\n      admin\n      aggregateAmount\n      category\n      chainId\n      claimedAmount\n      claimedCount\n      clawbackTime\n      expiration\n      expires\n      fee\n      hash\n      ipfsCID\n      lockup\n      name\n      nickname\n      root\n      streamCancelable\n      streamCliff\n      streamCliffDuration\n      streamCliffPercentage\n      streamInitial\n      streamInitialPercentage\n      streamShape\n      streamStart\n      streamStartTime\n      streamTotalDuration\n      streamTransferable\n      subgraphId\n      timestamp\n      totalRecipients\n      version\n      asset {\n        ...AssetFragment\n      }\n      factory {\n        ...FactoryFragment\n      }\n    }\n  ": typeof types.CampaignFragmentBaseFragmentDoc,
    "\n    fragment FactoryFragment on Factory {\n      id\n      address\n      alias\n    }\n  ": typeof types.FactoryFragmentFragmentDoc,
    "\n    fragment TrancheFragment on Tranche {\n      id\n      duration\n      endDuration\n      endPercentage\n      percentage\n      position\n      startDuration\n      startPercentage\n    }\n  ": typeof types.TrancheFragmentFragmentDoc,
    "\n  fragment CampaignFragment on Campaign {\n    ...CampaignFragmentBase\n    streamTranches(limit: 1000) {\n      ...TrancheFragment\n    }\n  }\n": typeof types.CampaignFragmentFragmentDoc,
    "\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n": typeof types.AssetFragmentFragmentDoc,
};
const documents: Documents = {
    "\n    fragment ActionFragment on Action {\n      id\n      block\n      category\n      chainId\n      claimAmount\n      claimIndex\n      claimRecipient\n      claimStreamId\n      claimTokenId\n      clawbackAmount\n      clawbackFrom\n      clawbackTo\n      fee\n      from\n      hash\n      subgraphId\n      timestamp\n      campaign {\n        id\n        name\n        nickname\n      }\n    }\n  ": types.ActionFragmentFragmentDoc,
    "\n    fragment ActivityFragment on Activity {\n      id\n      amount\n      claims\n      day\n      timestamp\n      campaign {\n        id\n      }\n    }\n  ": types.ActivityFragmentFragmentDoc,
    "\n    fragment CampaignFragmentBase on Campaign {\n      id\n      address\n      admin\n      aggregateAmount\n      category\n      chainId\n      claimedAmount\n      claimedCount\n      clawbackTime\n      expiration\n      expires\n      fee\n      hash\n      ipfsCID\n      lockup\n      name\n      nickname\n      root\n      streamCancelable\n      streamCliff\n      streamCliffDuration\n      streamCliffPercentage\n      streamInitial\n      streamInitialPercentage\n      streamShape\n      streamStart\n      streamStartTime\n      streamTotalDuration\n      streamTransferable\n      subgraphId\n      timestamp\n      totalRecipients\n      version\n      asset {\n        ...AssetFragment\n      }\n      factory {\n        ...FactoryFragment\n      }\n    }\n  ": types.CampaignFragmentBaseFragmentDoc,
    "\n    fragment FactoryFragment on Factory {\n      id\n      address\n      alias\n    }\n  ": types.FactoryFragmentFragmentDoc,
    "\n    fragment TrancheFragment on Tranche {\n      id\n      duration\n      endDuration\n      endPercentage\n      percentage\n      position\n      startDuration\n      startPercentage\n    }\n  ": types.TrancheFragmentFragmentDoc,
    "\n  fragment CampaignFragment on Campaign {\n    ...CampaignFragmentBase\n    streamTranches(limit: 1000) {\n      ...TrancheFragment\n    }\n  }\n": types.CampaignFragmentFragmentDoc,
    "\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n": types.AssetFragmentFragmentDoc,
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
export function gql(source: "\n    fragment ActionFragment on Action {\n      id\n      block\n      category\n      chainId\n      claimAmount\n      claimIndex\n      claimRecipient\n      claimStreamId\n      claimTokenId\n      clawbackAmount\n      clawbackFrom\n      clawbackTo\n      fee\n      from\n      hash\n      subgraphId\n      timestamp\n      campaign {\n        id\n        name\n        nickname\n      }\n    }\n  "): (typeof documents)["\n    fragment ActionFragment on Action {\n      id\n      block\n      category\n      chainId\n      claimAmount\n      claimIndex\n      claimRecipient\n      claimStreamId\n      claimTokenId\n      clawbackAmount\n      clawbackFrom\n      clawbackTo\n      fee\n      from\n      hash\n      subgraphId\n      timestamp\n      campaign {\n        id\n        name\n        nickname\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment ActivityFragment on Activity {\n      id\n      amount\n      claims\n      day\n      timestamp\n      campaign {\n        id\n      }\n    }\n  "): (typeof documents)["\n    fragment ActivityFragment on Activity {\n      id\n      amount\n      claims\n      day\n      timestamp\n      campaign {\n        id\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment CampaignFragmentBase on Campaign {\n      id\n      address\n      admin\n      aggregateAmount\n      category\n      chainId\n      claimedAmount\n      claimedCount\n      clawbackTime\n      expiration\n      expires\n      fee\n      hash\n      ipfsCID\n      lockup\n      name\n      nickname\n      root\n      streamCancelable\n      streamCliff\n      streamCliffDuration\n      streamCliffPercentage\n      streamInitial\n      streamInitialPercentage\n      streamShape\n      streamStart\n      streamStartTime\n      streamTotalDuration\n      streamTransferable\n      subgraphId\n      timestamp\n      totalRecipients\n      version\n      asset {\n        ...AssetFragment\n      }\n      factory {\n        ...FactoryFragment\n      }\n    }\n  "): (typeof documents)["\n    fragment CampaignFragmentBase on Campaign {\n      id\n      address\n      admin\n      aggregateAmount\n      category\n      chainId\n      claimedAmount\n      claimedCount\n      clawbackTime\n      expiration\n      expires\n      fee\n      hash\n      ipfsCID\n      lockup\n      name\n      nickname\n      root\n      streamCancelable\n      streamCliff\n      streamCliffDuration\n      streamCliffPercentage\n      streamInitial\n      streamInitialPercentage\n      streamShape\n      streamStart\n      streamStartTime\n      streamTotalDuration\n      streamTransferable\n      subgraphId\n      timestamp\n      totalRecipients\n      version\n      asset {\n        ...AssetFragment\n      }\n      factory {\n        ...FactoryFragment\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment FactoryFragment on Factory {\n      id\n      address\n      alias\n    }\n  "): (typeof documents)["\n    fragment FactoryFragment on Factory {\n      id\n      address\n      alias\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    fragment TrancheFragment on Tranche {\n      id\n      duration\n      endDuration\n      endPercentage\n      percentage\n      position\n      startDuration\n      startPercentage\n    }\n  "): (typeof documents)["\n    fragment TrancheFragment on Tranche {\n      id\n      duration\n      endDuration\n      endPercentage\n      percentage\n      position\n      startDuration\n      startPercentage\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment CampaignFragment on Campaign {\n    ...CampaignFragmentBase\n    streamTranches(limit: 1000) {\n      ...TrancheFragment\n    }\n  }\n"): (typeof documents)["\n  fragment CampaignFragment on Campaign {\n    ...CampaignFragmentBase\n    streamTranches(limit: 1000) {\n      ...TrancheFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n"): (typeof documents)["\n  fragment AssetFragment on Asset {\n    id\n    address\n    chainId\n    decimals\n    name\n    symbol\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;