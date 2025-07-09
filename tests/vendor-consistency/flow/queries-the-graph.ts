import { gql } from "graphql-request";
import * as F from "./fragments";

//
export const getStreams = gql /* GraphQL */`
  query getStreams($first: Int!, $skip: Int!, $chainId: BigInt!, $subgraphId: BigInt!) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { subgraphId_lt: $subgraphId, chainId: $chainId }
    ) {
      ...StreamFragment
      actions(
        orderBy: timestamp
        orderDirection: desc
        where: { category_in: [Create, Adjust, Pause, Void, Restart] }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.StreamFragment}
`;

export const getStreams_Asc = gql /* GraphQL */`
  query getStreams_Asc($first: Int!, $chainId: BigInt!, $subgraphId: BigInt!) {
    streams(first: $first, orderBy: subgraphId, orderDirection: asc, where: { subgraphId_gt: $subgraphId }) {
      ...StreamFragment
      actions(
        orderBy: timestamp
        orderDirection: desc
        where: { category_in: [Create, Adjust, Pause, Void, Restart] }
      ) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.StreamFragment}
`;
