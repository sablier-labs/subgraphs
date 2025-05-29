import * as fragments from "@src/gql/common/fragments";

export namespace Common {
  export import ActionFragment = fragments.ActionFragment;
  export import AssetFragment = fragments.AssetFragment;
  export import BatchFragment = fragments.BatchFragment;

  export const SegmentFragment = /* GraphQL */ `
    fragment SegmentFragment on Segment {
      id
      amount
      endAmount
      endTime
      exponent
      milestone
      position
      startAmount
      startTime
    }
  `;

  export const TrancheFragment = /* GraphQL */ `
    fragment TrancheFragment on Tranche {
      id
      amount
      endAmount
      endTime
      position
      startAmount
      startTime
      timestamp
    }
  `;

  export const getStreamFragment = (firstArg: "first" | "limit"): string => {
    return /* GraphQL */ `
      fragment StreamFragment on Stream {
        id
        alias
        cancelable
        canceled
        canceledTime
        category
        chainId
        cliff
        cliffAmount
        cliffTime
        contract
        depositAmount
        endTime
        funder
        hash
        initial
        initialAmount
        intactAmount
        position
        proxender
        proxied
        recipient
        renounceTime
        sender
        shape
        startTime
        subgraphId
        timestamp
        tokenId
        transferable
        version
        withdrawnAmount
        asset {
          ...AssetFragment
        }
        batch {
          ...BatchFragment
        }
        segments(${firstArg}: 1000) {
          ...SegmentFragment
        }
        tranches(${firstArg}: 1000) {
          ...TrancheFragment
        }
      }
    `;
  };
}
