import { ethereum } from "@graphprotocol/graph-ts";
import { logInfo } from "../../common/logger";
import { createEntityAction, createEntityCampaignLL, createEntityCampaignLT } from "../entities";
import { isKnownLockup } from "../helpers";
import { CampaignCommonParams, CampaignLLParams, CampaignLTParams } from "../params";

export function processCreateMerkleLL(
  event: ethereum.Event,
  paramsCommon: CampaignCommonParams,
  paramsLL: CampaignLLParams,
): void {
  const lockupAddress = paramsLL.lockup.toHexString();
  if (!isKnownLockup(lockupAddress)) {
    logInfo("Unknown deployment of LockupLinear {} used in airdrop campaign", [lockupAddress]);
    return;
  }
  const campaign = createEntityCampaignLL(event, paramsCommon, paramsLL);
  createEntityAction(event, campaign, "Create");
}

export function processCreateMerkleLT(
  event: ethereum.Event,
  paramsCommon: CampaignCommonParams,
  paramsLT: CampaignLTParams,
): void {
  const lockupAddress = paramsLT.lockup.toHexString();
  if (!isKnownLockup(lockupAddress)) {
    logInfo("Unknown deployment of LockupTranched {}used in airdrop campaign", [lockupAddress]);
    return;
  }
  const campaign = createEntityCampaignLT(event, paramsCommon, paramsLT);
  createEntityAction(event, campaign, "Create");
}
