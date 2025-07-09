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
    batcher {
      id
    }
    size
  }
`;

export const StreamFragment = gql /* GraphQL */`
  fragment StreamFragment on Stream {
    id
    alias
    chainId
    subgraphId
    tokenId
    hash
    timestamp
    category
    contract
    position
    recipient
    sender
    startTime
    transferable
    version
    withdrawnAmount
    availableAmount
    creator
    depletionTime
    depositedAmount
    forgivenDebt
    lastAdjustmentTimestamp
    paused
    pausedTime
    ratePerSecond
    refundedAmount
    snapshotAmount
    voided
    voidedTime
    assetDecimals
    asset {
      ...AssetFragment
    }
    batch {
      ...BatchFragment
    }
    lastAdjustmentAction {
      id
    }
    pausedAction {
      id
    }
    voidedAction {
      id
    }
  }
`;
