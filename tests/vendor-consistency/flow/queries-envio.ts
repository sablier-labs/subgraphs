import { gql } from "graphql-request";
import * as F from "./fragments";

//
export const getStreams = gql /* GraphQL */`
  query getStreams($first: Int!, $skip: Int!, $chainId: numeric!, $subgraphId: numeric!) {
    Stream(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: { _and: [{ chainId: { _eq: $chainId } }, { subgraphId: { _lt: $subgraphId } }] }
    ) {
      ...StreamFragment
      actions(order_by: { timestamp: desc }, where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }) {
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
  query getStreams_Asc($first: Int!, $chainId: numeric!, $subgraphId: numeric!) {
    Stream(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: asc }
      where: { _and: [{ chainId: { _eq: $chainId } }, { subgraphId: { _gt: $subgraphId } }] }
    ) {
      ...StreamFragment
      actions(order_by: { timestamp: desc }, where: { category: { _in: [Create, Adjust, Pause, Void, Restart] } }) {
        ...ActionFragment
      }
    }
  }
  ${F.ActionFragment}
  ${F.AssetFragment}
  ${F.BatchFragment}
  ${F.StreamFragment}
`;
