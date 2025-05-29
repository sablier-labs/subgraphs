export const ActionFragment = /* GraphQL */ `
  fragment ActionFragment on Action {
    id
    addressA
    addressB
    amountA
    amountB
    contract
    block
    category
    chainId
    from
    hash
    subgraphId
    timestamp
    stream {
      id
    }
  }
`;
