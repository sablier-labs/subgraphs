import { ethereum } from "@graphprotocol/graph-ts";
import { logInfo } from "../../common/logger";
import { isOfficialLockup } from "../helpers";
import { Params } from "../helpers/types";
import { Store } from "../store";
export namespace Processor {
  export namespace Create {
    export function merkleLL(
      event: ethereum.Event,
      paramsBase: Params.CampaignBase,
      paramsLL: Params.CampaignLL,
    ): void {
      const lockup = paramsLL.lockup;
      if (!isOfficialLockup(lockup)) {
        logInfo("Unknown deployment of LockupLinear {} used in airdrop campaign", [lockup.toHexString()]);
        return;
      }
      const campaign = Store.Campaign.createLL(event, paramsBase, paramsLL);
      Store.Action.create(event, campaign, { category: "Create" } as Params.Action);
    }

    export function merkleLT(
      event: ethereum.Event,
      paramsBase: Params.CampaignBase,
      paramsLT: Params.CampaignLT,
    ): void {
      const lockup = paramsLT.lockup;
      if (!isOfficialLockup(lockup)) {
        logInfo("Unknown deployment of LockupTranched {} used in airdrop campaign", [lockup.toHexString()]);
        return;
      }
      const campaign = Store.Campaign.createLT(event, paramsBase, paramsLT);
      Store.Action.create(event, campaign, { category: "Create" } as Params.Action);
    }
  }
}
