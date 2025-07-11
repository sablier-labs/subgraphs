import { gql } from "graphql-request";
import * as F from "./fragments";

//
export const getStreams = gql /* GraphQL */`
  query getStreams(
    $first: Int!
    $skip: Int!
    $chainId: numeric!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { subgraphId: { _lt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.SegmentFragment}
  ${F.StreamFragment_Envio}
  ${F.TrancheFragment}
`;

export const getStreams_Asc = gql /* GraphQL */`
  query getStreams_Asc(
    $first: Int!
    $chainId: numeric!
    $subgraphId: numeric!
  ) {
    Stream(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: asc }
      where: {
        _and: [
          { chainId: { _eq: $chainId } }
          { subgraphId: { _gt: $subgraphId } }
        ]
      }
    ) {
      ...StreamFragment
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.SegmentFragment}
  ${F.StreamFragment_Envio}
  ${F.TrancheFragment}
`;
