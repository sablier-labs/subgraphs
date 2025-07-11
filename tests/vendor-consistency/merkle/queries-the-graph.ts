import { gql } from "graphql-request";
import * as F from "./fragments";

export const getCampaigns = gql /* GraphQL */`
  query getCampaigns($first: Int!, $subgraphId: BigInt!) {
    campaigns(first: $first, orderBy: subgraphId, orderDirection: desc, where: { subgraphId_lt: $subgraphId }) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment}
  ${F.ActivityFragment}
  ${F.AssetFragment}
  ${F.FactoryFragment}
  ${F.TrancheFragment}
`;

export const getCampaigns_Asc = gql /* GraphQL */`
  query getCampaigns($first: Int!, $subgraphId: BigInt!, $chainId: Int!) {
    campaigns(first: $first, orderBy: subgraphId, orderDirection: asc, where: { subgraphId_gt: $subgraphId }) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment}
  ${F.ActivityFragment}
  ${F.AssetFragment}
  ${F.FactoryFragment}
  ${F.TrancheFragment}
`;
