import { createAction } from "./entity-action";
import { createOrUpdateActivity } from "./entity-activity";
import { getOrCreateAsset } from "./entity-asset";
import { createCampaignInstant, createCampaignLL, createCampaignLT, getCampaign } from "./entity-campaign";
import { getOrCreateFactory } from "./entity-factory";
import { getOrCreateWatcher } from "./entity-watcher";

export namespace Store {
  export namespace Action {
    export const create = createAction;
  }

  export namespace Activity {
    export const createOrUpdate = createOrUpdateActivity;
  }

  export namespace Asset {
    export const getOrCreate = getOrCreateAsset;
  }
  export namespace Campaign {
    export const createInstant = createCampaignInstant;
    export const createLL = createCampaignLL;
    export const createLT = createCampaignLT;
    export const get = getCampaign;
  }

  export namespace Factory {
    export const getOrCreate = getOrCreateFactory;
  }

  export namespace Watcher {
    export const getOrCreate = getOrCreateWatcher;
  }
}
