import {
  MerkleLockupFactoryV21,
  MerkleLockupFactoryV22,
  MerkleLockupFactoryV23,
} from "../../generated";

import type {
  CreateLinearLoader_V21,
  CreateLinearHandler_V21,
  CreateLinearLoader_V22,
  CreateLinearHandler_V22,
  CreateTranchedLoader_V22,
  CreateTranchedHandler_V22,
  Action,
  CreateLinearRegister_V21,
  CreateLinearRegister_V22,
  CreateTranchedRegister_V22,
  CreateLinearLoader_V23,
  CreateLinearHandler_V23,
  CreateTranchedLoader_V23,
  CreateTranchedHandler_V23,
  CreateLinearRegister_V23,
  CreateTranchedRegister_V23,
  CreateInstantRegister_V23,
  CreateInstantLoader_V23,
  CreateInstantHandler_V23,
} from "../types";

import {
  createAction,
  createInstantCampaign_V23,
  createLinearCampaign_V21,
  createLinearCampaign_V22,
  createLinearCampaign_V23,
  createTranchedCampaign_V22,
  createTranchedCampaign_V23,
  generateAssetId,
  generateFactoryIdFromEvent,
  getOrCreateAsset,
  initialize,
} from "../helpers";
import { ActionCategory, isWhitelistedShape } from "../constants";

async function loaderLinear_V21(input: CreateLinearLoader_V21) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.asset);
  const factoryId = generateFactoryIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, factory, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Factory.get(factoryId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    factory,
    watcher,
  };
}

async function loaderLinear_V22(input: CreateLinearLoader_V22) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.baseParams[0]);
  const factoryId = generateFactoryIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, factory, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Factory.get(factoryId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    factory,
    watcher,
  };
}

async function loaderLinear_V23(input: CreateLinearLoader_V23) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.baseParams[0]);
  const factoryId = generateFactoryIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, factory, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Factory.get(factoryId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    factory,
    watcher,
  };
}

async function loaderTranched_V22(input: CreateTranchedLoader_V22) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.baseParams[0]);
  const factoryId = generateFactoryIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, factory, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Factory.get(factoryId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    factory,
    watcher,
  };
}

async function loaderTranched_V23(input: CreateTranchedLoader_V23) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.baseParams[0]);
  const factoryId = generateFactoryIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, factory, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Factory.get(factoryId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    factory,
    watcher,
  };
}

async function loaderInstant_V23(input: CreateInstantLoader_V23) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.baseParams[0]);
  const factoryId = generateFactoryIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, factory, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Factory.get(factoryId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    factory,
    watcher,
  };
}

async function handlerLinear_V21(
  input: CreateLinearHandler_V21<typeof loaderLinear_V21>,
) {
  const { context, event } = input;

  /** ------- Authorize -------- */

  if (!isWhitelistedShape(event.chainId, event.params.lockupLinear)) {
    return;
  }

  /** ------- Initialize -------- */

  let { watcher, factory, factories } = await initialize(
    event,
    context.Watcher.get,
    context.Factory.get,
  );

  /** ------- Fetch -------- */

  let asset = await getOrCreateAsset(
    event,
    event.params.asset,
    context.Asset.get,
  );

  /** ------- Process -------- */

  let { campaign, ...post_create } = await createLinearCampaign_V21(event, {
    asset,
    factory,
    watcher,
  });

  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  watcher = post_action.watcher;

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    campaign_id: campaign.id,
  };

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (factories.length) {
    for (let i = 0; i < factories.length; i++) {
      if (factories[i].id === factory.id) {
        await context.Factory.set(factory);
      }
      await context.Factory.set(factories[i]);
    }
  }

  await context.Action.set(action);
  await context.Campaign.set(campaign);
  await context.Watcher.set(watcher);
}

async function handlerLinear_V22(
  input: CreateLinearHandler_V22<typeof loaderLinear_V22>,
) {
  const { context, event } = input;

  /** ------- Authorize -------- */

  if (!isWhitelistedShape(event.chainId, event.params.lockupLinear)) {
    return;
  }

  /** ------- Initialize -------- */

  let { watcher, factory, factories } = await initialize(
    event,
    context.Watcher.get,
    context.Factory.get,
  );

  /** ------- Fetch -------- */

  let asset = await getOrCreateAsset(
    event,
    event.params.baseParams[0],
    context.Asset.get,
  );

  /** ------- Process -------- */

  let { campaign, ...post_create } = await createLinearCampaign_V22(event, {
    asset,
    factory,
    watcher,
  });

  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  watcher = post_action.watcher;

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    campaign_id: campaign.id,
  };

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (factories.length) {
    for (let i = 0; i < factories.length; i++) {
      if (factories[i].id === factory.id) {
        await context.Factory.set(factory);
      }
      await context.Factory.set(factories[i]);
    }
  }

  await context.Action.set(action);
  await context.Campaign.set(campaign);
  await context.Watcher.set(watcher);
}

async function handlerLinear_V23(
  input: CreateLinearHandler_V23<typeof loaderLinear_V23>,
) {
  const { context, event } = input;

  /** ------- Authorize -------- */

  if (!isWhitelistedShape(event.chainId, event.params.lockup)) {
    return;
  }

  /** ------- Initialize -------- */

  let { watcher, factory, factories } = await initialize(
    event,
    context.Watcher.get,
    context.Factory.get,
  );

  /** ------- Fetch -------- */

  let asset = await getOrCreateAsset(
    event,
    event.params.baseParams[0],
    context.Asset.get,
  );

  /** ------- Process -------- */

  let { campaign, ...post_create } = await createLinearCampaign_V23(event, {
    asset,
    factory,
    watcher,
  });

  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  watcher = post_action.watcher;

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    campaign_id: campaign.id,
  };

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (factories.length) {
    for (let i = 0; i < factories.length; i++) {
      if (factories[i].id === factory.id) {
        await context.Factory.set(factory);
      }
      await context.Factory.set(factories[i]);
    }
  }

  await context.Action.set(action);
  await context.Campaign.set(campaign);
  await context.Watcher.set(watcher);
}
async function handlerTranched_V22(
  input: CreateTranchedHandler_V22<typeof loaderTranched_V22>,
) {
  const { context, event } = input;

  /** ------- Authorize -------- */

  if (!isWhitelistedShape(event.chainId, event.params.lockupTranched)) {
    return;
  }

  /** ------- Initialize -------- */

  let { watcher, factory, factories } = await initialize(
    event,
    context.Watcher.get,
    context.Factory.get,
  );

  /** ------- Fetch -------- */

  let asset = await getOrCreateAsset(
    event,
    event.params.baseParams[0],
    context.Asset.get,
  );

  /** ------- Process -------- */

  let { campaign, tranches, ...post_create } = await createTranchedCampaign_V22(
    event,
    {
      asset,
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  watcher = post_action.watcher;

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    campaign_id: campaign.id,
  };

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (factories.length) {
    for (let i = 0; i < factories.length; i++) {
      if (factories[i].id === factory.id) {
        await context.Factory.set(factory);
      }
      await context.Factory.set(factories[i]);
    }
  }

  if (tranches.length) {
    for (let i = 0; i < tranches.length; i++) {
      await context.Tranche.set(tranches[i]);
    }
  }

  await context.Action.set(action);
  await context.Campaign.set(campaign);
  await context.Watcher.set(watcher);
}
async function handlerTranched_V23(
  input: CreateTranchedHandler_V23<typeof loaderTranched_V23>,
) {
  const { context, event } = input;

  /** ------- Authorize -------- */

  if (!isWhitelistedShape(event.chainId, event.params.lockup)) {
    return;
  }

  /** ------- Initialize -------- */

  let { watcher, factory, factories } = await initialize(
    event,
    context.Watcher.get,
    context.Factory.get,
  );

  /** ------- Fetch -------- */

  let asset = await getOrCreateAsset(
    event,
    event.params.baseParams[0],
    context.Asset.get,
  );

  /** ------- Process -------- */

  let { campaign, tranches, ...post_create } = await createTranchedCampaign_V23(
    event,
    {
      asset,
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  watcher = post_action.watcher;

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    campaign_id: campaign.id,
  };

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (factories.length) {
    for (let i = 0; i < factories.length; i++) {
      if (factories[i].id === factory.id) {
        await context.Factory.set(factory);
      }
      await context.Factory.set(factories[i]);
    }
  }

  if (tranches.length) {
    for (let i = 0; i < tranches.length; i++) {
      await context.Tranche.set(tranches[i]);
    }
  }

  await context.Action.set(action);
  await context.Campaign.set(campaign);
  await context.Watcher.set(watcher);
}

async function handlerInstant_V23(
  input: CreateInstantHandler_V23<typeof loaderInstant_V23>,
) {
  const { context, event } = input;

  /** ------- Initialize -------- */

  let { watcher, factory, factories } = await initialize(
    event,
    context.Watcher.get,
    context.Factory.get,
  );

  /** ------- Fetch -------- */

  let asset = await getOrCreateAsset(
    event,
    event.params.baseParams[0],
    context.Asset.get,
  );

  /** ------- Process -------- */

  let { campaign, ...post_create } = await createInstantCampaign_V23(event, {
    asset,
    factory,
    watcher,
  });

  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  watcher = post_action.watcher;

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    campaign_id: campaign.id,
  };

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (factories.length) {
    for (let i = 0; i < factories.length; i++) {
      if (factories[i].id === factory.id) {
        await context.Factory.set(factory);
      }
      await context.Factory.set(factories[i]);
    }
  }

  await context.Action.set(action);
  await context.Campaign.set(campaign);
  await context.Watcher.set(watcher);
}
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

MerkleLockupFactoryV21.CreateMerkleStreamerLL.handlerWithLoader({
  loader: loaderLinear_V21,
  handler: handlerLinear_V21,
});
MerkleLockupFactoryV22.CreateMerkleLL.handlerWithLoader({
  loader: loaderLinear_V22,
  handler: handlerLinear_V22,
});
MerkleLockupFactoryV23.CreateMerkleLL.handlerWithLoader({
  loader: loaderLinear_V23,
  handler: handlerLinear_V23,
});
MerkleLockupFactoryV22.CreateMerkleLT.handlerWithLoader({
  loader: loaderTranched_V22,
  handler: handlerTranched_V22,
});
MerkleLockupFactoryV23.CreateMerkleLT.handlerWithLoader({
  loader: loaderTranched_V23,
  handler: handlerTranched_V23,
});
MerkleLockupFactoryV23.CreateMerkleInstant.handlerWithLoader({
  loader: loaderInstant_V23,
  handler: handlerInstant_V23,
});

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

MerkleLockupFactoryV21.CreateMerkleStreamerLL.contractRegister(
  (input: CreateLinearRegister_V21) => {
    const { context, event } = input;

    if (isWhitelistedShape(event.chainId, event.params.lockupLinear)) {
      context.addMerkleLockupV21(event.params.merkleStreamer);
    }
  },
  {
    preRegisterDynamicContracts: true,
  },
);

MerkleLockupFactoryV22.CreateMerkleLL.contractRegister(
  (input: CreateLinearRegister_V22) => {
    const { context, event } = input;

    if (isWhitelistedShape(event.chainId, event.params.lockupLinear)) {
      context.addMerkleLockupV22(event.params.merkleLL);
    }
  },
  {
    preRegisterDynamicContracts: true,
  },
);
MerkleLockupFactoryV23.CreateMerkleLL.contractRegister(
  (input: CreateLinearRegister_V23) => {
    const { context, event } = input;

    if (isWhitelistedShape(event.chainId, event.params.lockup)) {
      context.addMerkleLockupV23(event.params.merkleLL);
    }
  },
  {
    preRegisterDynamicContracts: true,
  },
);
MerkleLockupFactoryV22.CreateMerkleLT.contractRegister(
  (input: CreateTranchedRegister_V22) => {
    const { context, event } = input;

    if (isWhitelistedShape(event.chainId, event.params.lockupTranched)) {
      context.addMerkleLockupV22(event.params.merkleLT);
    }
  },
  {
    preRegisterDynamicContracts: true,
  },
);
MerkleLockupFactoryV23.CreateMerkleLT.contractRegister(
  (input: CreateTranchedRegister_V23) => {
    const { context, event } = input;

    if (isWhitelistedShape(event.chainId, event.params.lockup)) {
      context.addMerkleLockupV23(event.params.merkleLT);
    }
  },
  {
    preRegisterDynamicContracts: true,
  },
);
MerkleLockupFactoryV23.CreateMerkleInstant.contractRegister(
  (input: CreateInstantRegister_V23) => {
    const { context, event } = input;
    context.addMerkleInstant(event.params.merkleInstant);
  },
  {
    preRegisterDynamicContracts: true,
  },
);
