import { gql } from "graphql-request";
import * as F from "./fragments";

export const getCampaigns = gql /* GraphQL */`
  query getCampaigns(
    $first: Int!
    $subgraphId: numeric!
    $chainId: numeric!
    $asset: String # Required for compatibility
  ) {
    Campaign(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: { _and: [{ subgraphId: { _lt: $subgraphId } }, { chainId: { _eq: $chainId } }] }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment}
  ${F.ActivityFragment}
  ${F.AssetFragment}
  ${F.FactoryFragment}
  ${F.TrancheFragment}
`;

export const getCampaigns_Asc = gql /* GraphQL */`
  query getCampaigns($first: Int!, $subgraphId: numeric!, $chainId: numeric!) {
    Campaign(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: asc }
      where: { chainId: { _eq: $chainId }, subgraphId: { _gt: $subgraphId } }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment}
  ${F.ActivityFragment}
  ${F.AssetFragment}
  ${F.FactoryFragment}
  ${F.TrancheFragment}
`;
