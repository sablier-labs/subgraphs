import { gql } from "graphql-request";
import * as F from "./fragments";

export const getCampaigns_ByAdminByIds = gql/* GraphQL */ `
  query getCampaigns_ByAdminByIds(
    $first: Int!
    $skip: Int!
    $admin: Bytes!
    $airdropIds: [String!]
    $subgraphId: BigInt!
    $chainId: BigInt!
  ) {
    campaigns(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        and: [
          { admin: $admin }
          { id_in: $airdropIds }
          { subgraphId_lt: $subgraphId }
          { chainId: $chainId }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaigns_ByAdminByAsset = gql/* GraphQL */ `
  query getCampaigns_ByAdminByAsset(
    $first: Int!
    $skip: Int!
    $admin: Bytes!
    $asset: String!
    $subgraphId: BigInt!
    $chainId: BigInt!
  ) {
    campaigns(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        and: [
          { admin: $admin }
          { asset: $asset }
          { subgraphId_lt: $subgraphId }
          { chainId: $chainId }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaigns_ByAdmin = gql/* GraphQL */ `
  query getCampaigns_ByAdmin(
    $first: Int!
    $skip: Int!
    $admin: Bytes!
    $subgraphId: BigInt!
    $chainId: BigInt!
  ) {
    campaigns(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        and: [
          { admin: $admin }
          { subgraphId_lt: $subgraphId }
          { chainId: $chainId }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaigns_ByIds = gql/* GraphQL */ `
  query getCampaigns_ByIds(
    $first: Int!
    $skip: Int!
    $airdropIds: [String!]
    $subgraphId: BigInt!
    $chainId: BigInt!
  ) {
    campaigns(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: {
        id_in: $airdropIds
        subgraphId_lt: $subgraphId
        chainId: $chainId
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaigns_ByAsset = gql/* GraphQL */ `
  query getCampaigns_ByAsset(
    $first: Int!
    $skip: Int!
    $asset: String!
    $subgraphId: BigInt!
    $chainId: BigInt!
  ) {
    campaigns(
      first: $first
      skip: $skip
      orderBy: subgraphId
      orderDirection: desc
      where: { asset: $asset, subgraphId_lt: $subgraphId, chainId: $chainId }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaigns = gql/* GraphQL */ `
  query getCampaigns($first: Int!, $subgraphId: BigInt!) {
    campaigns(
      first: $first
      orderBy: subgraphId
      orderDirection: desc
      where: { subgraphId_lt: $subgraphId }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaigns_Asc = gql/* GraphQL */ `
  query getCampaigns($first: Int!, $subgraphId: BigInt!, $chainId: Int!) {
    campaigns(
      first: $first
      orderBy: subgraphId
      orderDirection: asc
      where: { subgraphId_gt: $subgraphId }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getCampaignById = gql/* GraphQL */ `
  query getCampaignById($airdropId: ID!) {
    campaign(id: $airdropId) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;

export const getActions_ByCampaign = gql/* GraphQL */ `
  query getActions_ByCampaign(
    $first: Int!
    $airdropId: String!
    $subgraphId: BigInt!
    $chainId: BigInt!
  ) {
    actions(
      first: $first
      orderBy: subgraphId
      orderDirection: desc
      where: {
        campaign: $airdropId
        subgraphId_lt: $subgraphId
        chainId: $chainId
      }
    ) {
      ...ActionFragment
      campaign {
        id
        asset {
          ...AssetFragment
        }
      }
    }
  }

  ${F.ActionFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
`;

export const getMetadata_ByCampaign = gql/* GraphQL */ `
  query getMetadata_ByCampaign(
    $campaignId: ID!
    $campaignIdClone: String!
    $dayFrom: BigInt!
    $dayTo: BigInt!
  ) {
    campaign(id: $campaignId) {
      id
      asset {
        ...AssetFragment
      }
      activities(first: 7, where: { day_gte: $dayFrom, day_lte: $dayTo }) {
        ...ActivityFragment
      }
      actions(first: 5, orderBy: subgraphId, orderDirection: desc) {
        ...ActionFragment
      }
    }
    actions(
      first: 10
      orderBy: subgraphId
      orderDirection: desc
      where: { campaign: $campaignIdClone, category: Claim }
    ) {
      ...ActionFragment
    }
  }

  ${F.CampaignFragment_TheGraph}
  ${F.ActionFragment_TheGraph}
  ${F.ActivityFragment_TheGraph}
  ${F.AssetFragment_TheGraph}
  ${F.FactoryFragment_TheGraph}
  ${F.TrancheFragment_TheGraph}
`;
