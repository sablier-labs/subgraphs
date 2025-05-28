import { Address, DataSourceContext, ethereum } from "@graphprotocol/graph-ts";
import { readChainId } from "../../common/context";
import { logInfo } from "../../common/logger";
import { isOfficialLockup } from "../helpers";
import { Params } from "../helpers/types";
import { Store } from "../store";
export namespace Processor {
  export namespace Create {
    export function merkleLL(
      templateCreator: (address: Address, context: DataSourceContext) => void,
      event: ethereum.Event,
      paramsBase: Params.CampaignBase,
      paramsLL: Params.CampaignLL,
    ): void {
      const lockup = paramsLL.lockup;
      if (!isOfficialLockup(lockup)) {
        logInfo("Unknown deployment of LockupLinear {} used in airdrop campaign", [lockup.toHexString()]);
        return;
      }

      /* -------------------------------- TEMPLATE -------------------------------- */
      const context = new DataSourceContext();
      context.setBigInt("chainId", readChainId());
      templateCreator(paramsBase.campaignAddress, context);

      /* -------------------------------- CAMPAIGN -------------------------------- */
      const campaign = Store.Campaign.createLL(event, paramsBase, paramsLL);

      /* --------------------------------- ACTION --------------------------------- */
      Store.Action.create(event, campaign, { category: "Create" } as Params.Action);
    }

    export function merkleLT(
      templateCreator: (address: Address, context: DataSourceContext) => void,
      event: ethereum.Event,
      paramsBase: Params.CampaignBase,
      paramsLT: Params.CampaignLT,
    ): void {
      const lockup = paramsLT.lockup;
      if (!isOfficialLockup(lockup)) {
        logInfo("Unknown deployment of LockupTranched {} used in airdrop campaign", [lockup.toHexString()]);
        return;
      }

      /* -------------------------------- TEMPLATE -------------------------------- */
      const context = new DataSourceContext();
      context.setBigInt("chainId", readChainId());
      templateCreator(paramsBase.campaignAddress, context);

      /* -------------------------------- CAMPAIGN -------------------------------- */
      const campaign = Store.Campaign.createLT(event, paramsBase, paramsLT);

      /* --------------------------------- ACTION --------------------------------- */
      Store.Action.create(event, campaign, { category: "Create" } as Params.Action);
    }
  }
}
