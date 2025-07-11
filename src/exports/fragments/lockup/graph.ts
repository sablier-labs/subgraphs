import { gql } from "../../gql/graph/lockup/gql";
import { Both } from "./both";

export const ActionFragment = gql(Both.ActionFragment);
export const AssetFragment = gql(Both.AssetFragment);
export const BatchFragment = gql(Both.BatchFragment);

export const StreamFragment = gql(/* GraphQL */ `
  fragment StreamFragment on Stream {
    ...StreamFragmentBase
    segments(first: 1000) {
      ...SegmentFragment
    }
    tranches(first: 1000) {
      ...TrancheFragment
    }
  }
`);
