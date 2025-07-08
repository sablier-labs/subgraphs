import { gql } from "graphql-request";

export const ContractFragment_Envio = gql/* GraphQL */ `
  fragment ContractFragment on Contract {
    id
    address
    version
  }
`;

export const ActionFragment_Envio = gql/* GraphQL */ `
  fragment ActionFragment on Action {
    chainId
    subgraphId
    stream {
      id
    }
    category
    hash
    block
    timestamp
    from
    addressA
    addressB
    amountA
    amountB
  }
`;

export const BatchFragment_Envio = gql/* GraphQL */ `
  fragment BatchFragment on Batch {
    size
  }
`;

export const AssetFragment_Envio = gql/* GraphQL */ `
  fragment AssetFragment on Asset {
    address
    chainId
    decimals
    name
    symbol
  }
`;

export const StreamFragment_Envio = gql/* GraphQL */ `
  fragment StreamFragment on Stream {
    id
    tokenId
    subgraphId
    category
    chainId
    # alias
    creator
    sender
    recipient
    hash
    timestamp
    startTime
    depletionTime
    transferable
    forgivenDebt
    paused
    pausedTime
    voided
    voidedTime
    lastAdjustmentTimestamp
    availableAmount
    ratePerSecond
    depositedAmount
    refundedAmount
    withdrawnAmount
    snapshotAmount
    position
    asset {
      ...AssetFragment
    }
    batch {
      ...BatchFragment
    }
  }
`;

export const ContractFragment_TheGraph = gql/* GraphQL */ `
  fragment ContractFragment on Contract {
    id
    address
    version
  }
`;

export const ActionFragment_TheGraph = gql/* GraphQL */ `
  fragment ActionFragment on Action {
    chainId
    subgraphId
    stream {
      id
    }
    category
    hash
    block
    timestamp
    from
    addressA
    addressB
    amountA
    amountB
    # contract {
    #   ...ContractFragment
    # }
  }
`;

export const BatchFragment_TheGraph = gql/* GraphQL */ `
  fragment BatchFragment on Batch {
    size
  }
`;

export const AssetFragment_TheGraph = gql/* GraphQL */ `
  fragment AssetFragment on Asset {
    address
    chainId
    decimals
    name
    symbol
  }
`;

export const StreamFragment_TheGraph = gql/* GraphQL */ `
  fragment StreamFragment on Stream {
    id
    tokenId
    subgraphId
    category
    chainId
    # alias
    creator
    sender
    recipient
    hash
    timestamp
    startTime
    depletionTime
    transferable
    forgivenDebt
    paused
    pausedTime
    voided
    voidedTime
    lastAdjustmentTimestamp
    availableAmount
    ratePerSecond
    depositedAmount
    refundedAmount
    withdrawnAmount
    snapshotAmount
    position
    asset {
      ...AssetFragment
    }
    batch {
      ...BatchFragment
    }
    # contract {
    #   ...ContractFragment
    # }
  }
`;
