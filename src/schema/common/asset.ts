import { gql } from "graphql-tag";
import type { Types } from "../../types";

const streams = `#graphql
"""
Streams that rely on this token
"""
streams: [Stream!]! @derivedFrom(field: "asset")
`;

const campaigns = `#graphql
"""
Campaigns that rely on this asset.
"""
campaigns: [Campaign!]! @derivedFrom(field: "asset")
`;

export function getAssetDefs(protocol: Types.Protocol) {
  const customField = protocol !== "airdrops" ? streams : campaigns;

  return gql`
    """
    ERC-20 asset
    """
    type Asset @entity(immutable: true) {
      """
      Contract address of the ERC20 token
      """
      id: ID!
      """
      Alias for id
      """
      address: Bytes!
      """
      The id of the chain, e.g. 137 for Polygon
      """
      chainId: BigInt!
      """
      Decimals of the ERC20 token
      """
      decimals: BigInt!
      """
      Name of the ERC20 token
      """
      name: String!
      """
      Symbol of the ERC20 token
      """
      symbol: String!
      ${customField}
    }
  `;
}
