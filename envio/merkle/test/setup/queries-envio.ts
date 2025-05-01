import { gql } from "graphql-request";
import * as F from "./fragments";

export const getCampaigns_ByAdminByIds = gql/* GraphQL */ `
  query getCampaigns_ByAdminByIds(
    $first: Int!
    $skip: Int!
    $admin: String!
    $airdropIds: [String!]
    $subgraphId: numeric!
    $chainId: numeric!
  ) {
    Campaign(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { admin: { _eq: $admin } }
          { id: { _in: $airdropIds } }
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaigns_ByAdminByAsset = gql/* GraphQL */ `
  query getCampaigns_ByAdminByAsset(
    $first: Int!
    $skip: Int!
    $admin: String!
    $asset: String!
    $subgraphId: numeric!
    $chainId: numeric!
  ) {
    Campaign(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { admin: { _eq: $admin } }
          { asset_id: { _iregex: $asset } }
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaigns_ByAdmin = gql/* GraphQL */ `
  query getCampaigns_ByAdmin(
    $first: Int!
    $skip: Int!
    $admin: String!
    $subgraphId: numeric!
    $chainId: numeric!
    $asset: String # Required for compatibility
  ) {
    Campaign(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { admin: { _eq: $admin } }
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaigns_ByIds = gql/* GraphQL */ `
  query getCampaigns_ByIds(
    $first: Int!
    $skip: Int!
    $airdropIds: [String!]
    $subgraphId: numeric!
    $chainId: numeric!
    $asset: String # Required for compatibility
  ) {
    Campaign(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { id: { _in: $airdropIds } }
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaigns_ByAsset = gql/* GraphQL */ `
  query getCampaigns_ByAsset(
    $first: Int!
    $skip: Int!
    $asset: String!
    $subgraphId: numeric!
    $chainId: numeric!
  ) {
    Campaign(
      limit: $first
      offset: $skip
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { asset_id: { _iregex: $asset } }
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaigns = gql/* GraphQL */ `
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
      where: {
        _and: [
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
      }
    ) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaigns_Asc = gql/* GraphQL */ `
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
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getCampaignById = gql/* GraphQL */ `
  query getCampaignById($airdropId: String!) {
    Campaign(where: { id: { _eq: $airdropId } }) {
      ...CampaignFragment
    }
  }

  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;

export const getActions_ByCampaign = gql/* GraphQL */ `
  query getActions_ByCampaign(
    $first: Int!
    $airdropId: String!
    $subgraphId: numeric!
    $chainId: numeric!
  ) {
    Action(
      limit: $first
      distinct_on: [subgraphId]
      order_by: { subgraphId: desc }
      where: {
        _and: [
          { campaign_id: { _eq: $airdropId } }
          { subgraphId: { _lt: $subgraphId } }
          { chainId: { _eq: $chainId } }
        ]
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

  ${F.ActionFragment_Envio}
  ${F.AssetFragment_Envio}
`;

export const getMetadata_ByCampaign = gql/* GraphQL */ `
  query getMetadata_ByCampaign(
    $campaignId: String!
    $campaignIdClone: String!
    $dayFrom: numeric!
    $dayTo: numeric!
  ) {
    Campaign(where: { id: { _eq: $campaignId } }) {
      id
      asset {
        ...AssetFragment
      }
      activities(
        limit: 7
        where: { _and: [{ day: { _gte: $dayFrom, _lte: $dayTo } }] }
      ) {
        ...ActivityFragment
      }
      actions(limit: 5, order_by: { subgraphId: desc }) {
        ...ActionFragment
      }
    }
    Action(
      limit: 10
      order_by: { subgraphId: desc }
      distinct_on: [subgraphId]
      where: {
        _and: [
          { campaign_id: { _eq: $campaignIdClone } }
          { category: { _eq: "Claim" } }
        ]
      }
    ) {
      ...ActionFragment
    }
  }
  ${F.CampaignFragment_Envio}
  ${F.ActionFragment_Envio}
  ${F.ActivityFragment_Envio}
  ${F.AssetFragment_Envio}
  ${F.FactoryFragment_Envio}
  ${F.TrancheFragment_Envio}
`;
