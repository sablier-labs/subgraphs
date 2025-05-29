import * as fragments from "@src/gql/common/fragments";

export namespace Common {
  export import ActionFragment = fragments.ActionFragment;
  export import AssetFragment = fragments.AssetFragment;
  export import BatchFragment = fragments.BatchFragment;

  export const StreamFragment = /* GraphQL */ `
    fragment StreamFragment on Stream {
      id
      alias
      availableAmount
      category
      chainId
      contract
      creator
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
