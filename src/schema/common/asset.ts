import { gql } from "graphql-tag";

export function getAssetSchema(relation: "campaigns" | "streams") {
  const relationField =
    relation === "streams"
      ? `"""
       Streams that rely on this token
       """
       streams: [Stream!]! @derivedFrom(field: "asset")`
      : `"""
       Campaigns that rely on this asset.
       """
       campaigns: [Campaign!]! @derivedFrom(field: "asset")`;

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
      ${relationField}
    }
  `;
}
