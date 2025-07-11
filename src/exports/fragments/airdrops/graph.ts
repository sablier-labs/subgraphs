import { gql } from "../../gql/graph/airdrops/gql";
import { Both } from "./both";

export const ActionFragment = gql(Both.ActionFragment);
export const ActivityFragment = gql(Both.ActivityFragment);
export const AssetFragment = gql(Both.AssetFragment);
export const FactoryFragment = gql(Both.FactoryFragment);
export const TrancheFragment = gql(Both.TrancheFragment);

export const CampaignFragment = gql(/* GraphQL */ `
  fragment CampaignFragment on Campaign {
    ...CampaignFragmentBase
    streamTranches(first: 1000) {
      ...TrancheFragment
    }
  }
`);
