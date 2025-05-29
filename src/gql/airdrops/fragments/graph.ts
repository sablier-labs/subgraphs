import { gql } from "@src/out/gql/envio/flow/gql"; // circular reference on purpose
import { Common } from "./common";

export const ActionFragment = gql(Common.ActionFragment);
export const ActivityFragment = gql(Common.ActivityFragment);
export const FactoryFragment = gql(Common.FactoryFragment);
export const TrancheFragment = gql(Common.TrancheFragment);
export const CampaignFragment = gql(Common.getCampaignFragment("first"));
