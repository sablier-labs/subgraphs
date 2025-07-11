import { gql } from "graphql-request";
import * as F from "./fragments";

export const getStreams = gql /* GraphQL */`
  query getStreams($first: Int!, $skip: Int!, $chainId: BigInt!, $subgraphId: BigInt!) {
    streams(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { subgraphId_lt: $subgraphId }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.SegmentFragment}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment}
`;

export const getStreams_Asc = gql /* GraphQL */`
  query getStreams_Asc($first: Int!, $chainId: BigInt!, $subgraphId: BigInt!) {
    streams(first: $first, orderBy: subgraphId, orderDirection: asc, where: { subgraphId_gt: $subgraphId }) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.SegmentFragment}
  ${F.StreamFragment_TheGraph}
  ${F.TrancheFragment}
`;
