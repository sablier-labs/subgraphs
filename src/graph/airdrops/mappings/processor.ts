import { ethereum } from "@graphprotocol/graph-ts";
import { logInfo } from "../../common/logger";
import { isKnownLockup } from "../helpers";
import { CampaignCommonParams, CampaignLLParams, CampaignLTParams } from "../helpers/types";
import { Store } from "../store";

export namespace Processor {
  export namespace Create {
    export function merkleLL(
      event: ethereum.Event,
      paramsCommon: CampaignCommonParams,
      paramsLL: CampaignLLParams,
    ): void {
      const lockupAddress = paramsLL.lockup.toHexString();
      if (!isKnownLockup(lockupAddress)) {
        logInfo("Unknown deployment of LockupLinear {} used in airdrop campaign", [lockupAddress]);
        return;
      }
      const campaign = Store.Campaign.createLL(event, paramsCommon, paramsLL);
      Store.Action.create(event, campaign, "Create");
    }

    export function merkleLT(
      event: ethereum.Event,
      paramsCommon: CampaignCommonParams,
      paramsLT: CampaignLTParams,
    ): void {
      const lockupAddress = paramsLT.lockup.toHexString();
      if (!isKnownLockup(lockupAddress)) {
        logInfo("Unknown deployment of LockupTranched {}used in airdrop campaign", [lockupAddress]);
        return;
      }
      const campaign = Store.Campaign.createLT(event, paramsCommon, paramsLT);
      Store.Action.create(event, campaign, "Create");
    }
  }
}
