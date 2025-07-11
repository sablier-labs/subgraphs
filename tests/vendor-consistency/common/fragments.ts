import { gql } from "graphql-request";

// Re-export for external usage
export const AssetFragment = gql /* GraphQL */`
  fragment AssetFragment on Asset {
    id
    address
    chainId
    decimals
    name
    symbol
  }
`;
