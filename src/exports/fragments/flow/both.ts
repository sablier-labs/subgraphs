import * as common from "../common";

export namespace Both {
  export import ActionFragment = common.ActionFragment;
  export import AssetFragment = common.AssetFragment;
  export import BatchFragment = common.BatchFragment;

  export const StreamFragment = /* GraphQL */ `
    fragment StreamFragment on Stream {
      id
      alias
      availableAmount
      category
      chainId
      creator
      contract
      depletionTime
      depositedAmount
      forgivenDebt
      hash
      lastAdjustmentTimestamp
      paused
      pausedTime
      position
      ratePerSecond
      recipient
      refundedAmount
      sender
      snapshotAmount
      startTime
      subgraphId
      timestamp
      tokenId
      transferable
      version
      voided
      voidedTime
      withdrawnAmount
      asset {
        ...AssetFragment
      }
      batch {
        ...BatchFragment
      }
    }
  `;
}
