import type { Context } from "@envio-airdrops/bindings";
import type { CreateEntities, Params } from "@envio-airdrops/helpers/types";
import { Store } from "@envio-airdrops/store";
import type { Address, Event } from "@envio-common/bindings";
import { Airdrops as enums } from "@src/schema/enums";
import { type Loader } from "./loader";

export namespace Processor {
  export namespace Create {
    type Input = {
      context: Context.Handler;
      event: Event;
      loaderReturn: Loader.CreateReturn;
      params: Params.CampaignLL | Params.CampaignLT;
    };

    export async function merkleLL(input: Input): Promise<void> {
      const { context, event, loaderReturn, params } = input;

      const campaignEntities = await loadEntities(context, event, loaderReturn, params.asset);
      const campaign = await Store.Campaign.createLL(context, event, campaignEntities, params as Params.CampaignLL);

      const actionEntities = {
        campaign,
        factory: campaignEntities.factory,
        watcher: campaignEntities.watcher,
      };
      await Store.Action.create(context, event, actionEntities, { category: enums.ActionCategory.Create });
    }

    export async function merkleLT(input: Input): Promise<void> {
      const { context, event, loaderReturn, params } = input;

      const campaignEntities = await loadEntities(context, event, loaderReturn, params.asset);
      const campaign = await Store.Campaign.createLT(context, event, campaignEntities, params as Params.CampaignLT);

      const actionEntities = {
        campaign,
        factory: campaignEntities.factory,
        watcher: campaignEntities.watcher,
      };
      await Store.Action.create(context, event, actionEntities, { category: enums.ActionCategory.Create });
    }

    async function loadEntities(
      context: Context.Handler,
      event: Event,
      loaderReturn: Loader.CreateReturn,
      assetAddress: Address,
    ): Promise<CreateEntities> {
      return {
        asset: loaderReturn.asset ?? (await Store.Asset.create(context, event.chainId, assetAddress)),
        factory: loaderReturn.factory ?? (await Store.Factory.create(context, event.chainId, event.srcAddress)),
        watcher: loaderReturn.watcher ?? (await Store.Watcher.create(event.chainId)),
      };
    }
  }
}
