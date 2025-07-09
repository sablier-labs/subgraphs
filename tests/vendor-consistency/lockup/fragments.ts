import { gql } from "graphql-request";
import { AssetFragment } from "../common";

// Re-export common fragments for query access
export { AssetFragment };

// ─────────────────────────────────────────────────────────────
// SHARED FRAGMENTS (used by both Envio and TheGraph)
// ─────────────────────────────────────────────────────────────

export const ActionFragment = gql /* GraphQL */`
  fragment ActionFragment on Action {
    id
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
    contract
    fee
  }
`;

export const BatchFragment = gql /* GraphQL */`
  fragment BatchFragment on Batch {
    id
    hash
    timestamp
    size
  }
`;

export const SegmentFragment = gql /* GraphQL */`
  fragment SegmentFragment on Segment {
    id
    position
    amount
    exponent
    endTime
    startTime
    startAmount
    endAmount
  }
`;

export const TrancheFragment = gql /* GraphQL */`
  fragment TrancheFragment on Tranche {
    id
    position
    amount
    endTime
    startTime
    endAmount
    startAmount
  }
`;

// ─────────────────────────────────────────────────────────────
// STREAM FRAGMENTS (Envio and TheGraph have different syntax)
// ─────────────────────────────────────────────────────────────

export const StreamFragment_Envio = gql /* GraphQL */`
  fragment StreamFragment on Stream {
    id
    tokenId
    subgraphId
    chainId
    alias
    category
    funder
    sender
    recipient
    hash
    timestamp
    depositAmount
    startTime
    endTime
    cliff
    cliffTime
    cliffAmount
    cancelable
    renounceTime
    canceled
    canceledTime
    withdrawnAmount
    intactAmount
    position
    proxied
    proxender
    transferable
    version
    assetDecimals
    duration
    parties
    shape
    initial
    initialAmount
    actions(order_by: { subgraphId: asc }, limit: 1000) {
      ...ActionFragment
    }
    asset {
      ...AssetFragment
    }
    batch {
      ...BatchFragment
    }
    contract
    segments(order_by: { position: asc }, limit: 1000) {
      ...SegmentFragment
    }
    tranches(order_by: { position: asc }, limit: 1000) {
      ...TrancheFragment
    }
  }
`;

export const StreamFragment_TheGraph = gql /* GraphQL */`
  fragment StreamFragment on Stream {
    id
    tokenId
    subgraphId
    chainId
    alias
    category
    funder
    sender
    recipient
    hash
    timestamp
    depositAmount
    startTime
    endTime
    cliff
    cliffTime
    cliffAmount
    cancelable
    renounceTime
    canceled
    canceledTime
    withdrawnAmount
    intactAmount
    position
    proxied
    proxender
    transferable
    version
    assetDecimals
    duration
    parties
    shape
    initial
    initialAmount
    actions(orderBy: subgraphId, orderDirection: asc, first: 1000) {
      ...ActionFragment
    }
    asset {
      ...AssetFragment
    }
    batch {
      ...BatchFragment
    }
    contract
    segments(orderBy: position, orderDirection: asc, first: 1000) {
      ...SegmentFragment
    }
    tranches(orderBy: position, orderDirection: asc, first: 1000) {
      ...TrancheFragment
    }
  }
`;
