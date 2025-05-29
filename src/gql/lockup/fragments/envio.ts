import { gql } from "@src/out/gql/envio/flow/gql"; // circular reference on purpose
import { Common } from "./common";

export const ActionFragment = gql(Common.ActionFragment);
export const BatchFragment = gql(Common.BatchFragment);
export const AssetFragment = gql(Common.AssetFragment);
// See https://github.com/enviodev/hyperindex/discussions/557
export const StreamFragment = gql(Common.getStreamFragment("limit"));
