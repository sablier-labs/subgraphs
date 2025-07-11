/**
 * This fragment is common between Flow and Lockup.
 */
export const ActionFragment = /* GraphQL */ `
  fragment ActionFragment on Action {
    id
    addressA
    addressB
    amountA
    amountB
    block
    category
    chainId
    contract
    from
    hash
    subgraphId
    timestamp
    stream {
      id
    }
  }
`;
