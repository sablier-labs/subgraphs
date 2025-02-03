import type {
  Address,
  Asset,
  Campaign,
  Event,
  Factory,
  Mutable,
  Watcher,
  CreateLinearArgs_V22,
  CreateLinearArgs_V21,
  CreateTranchedArgs_V22,
  CreateLinearArgs_V23,
  CreateTranchedArgs_V23,
  CreateInstantArgs_V23,
} from "../types";

import { StreamCategory, StreamVersion, ADDRESS_ZERO } from "../constants";
import { createTranches } from "./tranches";

type Entity = Partial<Mutable<Campaign>>;

function createCampaign(
  event: Event,
  address: Address,
  entities: {
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { factory, watcher } = entities;
  const id = generateCampaignId(event, address);

  /** --------------- */

  const entity = {
    id,
    address: address.toLowerCase(),
    subgraphId: BigInt(watcher.campaignIndex),
    hash: event.transaction.hash.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    chainId: BigInt(event.chainId),

    /** --------------- */

    name: "",
    lockup: ADDRESS_ZERO,

    clawbackAction_id: undefined,
    clawbackTime: undefined,

    claimedAmount: 0n,
    claimedCount: 0n,

    streamCliff: false,
    streamCliffDuration: 0n,
    streamCliffPercentage: 0n,
    streamStart: false,
    streamStartTime: 0n,
    streamInitial: false,
    streamInitialPercentage: 0n,
    streamTransferable: false,
    streamCancelable: false,
    streamShape: "",
    streamTotalDuration: 0n,
    fee: 0n,

    factory_id: factory.id,
  } satisfies Entity;

  /** --------------- */

  watcher = {
    ...watcher,
    campaignIndex: BigInt(watcher.campaignIndex) + 1n,
  };

  return {
    entity,
    watcher,
  };
}

export async function createLinearCampaign_V21(
  event: Event<CreateLinearArgs_V21>,
  entities: {
    asset: Asset;
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { asset, factory, watcher } = entities;

  const { entity: partial, ...post_create } = createCampaign(
    event,
    event.params.merkleStreamer,
    {
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  /** --------------- */

  let entity = {
    ...partial,
    expires: BigInt(event.params.expiration) !== 0n,
    expiration: BigInt(event.params.expiration),
    /** --------------- */
    admin: event.params.admin.toLowerCase(),
    lockup: event.params.lockupLinear.toLowerCase(),
    /** --------------- */
    root: event.params.merkleRoot,
    ipfsCID: event.params.ipfsCID,
    aggregateAmount: BigInt(event.params.aggregateAmount),
    totalRecipients: BigInt(event.params.recipientsCount),
    /** --------------- */
    category: StreamCategory.LockupLinear,
    streamCliff: BigInt(event.params.streamDurations[0]) !== 0n,
    streamCliffDuration: BigInt(event.params.streamDurations[0]),
    streamTotalDuration: BigInt(event.params.streamDurations[1]),
    streamCancelable: event.params.cancelable,
    streamTransferable: event.params.transferable,

    version: StreamVersion.V21,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  const campaign: Campaign = {
    ...entity,
    ...partAsset,

    nickname: generateCampaignNickname(entity, asset),
  };

  return {
    campaign,
    watcher,
  };
}

export async function createLinearCampaign_V22(
  event: Event<CreateLinearArgs_V22>,
  entities: {
    asset: Asset;
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { asset, factory, watcher } = entities;

  const { entity: partial, ...post_create } = createCampaign(
    event,
    event.params.merkleLL,
    {
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  /** --------------- */

  const params = {
    asset: event.params.baseParams[0],
    cancelable: event.params.baseParams[1],
    expiration: event.params.baseParams[2],
    initialAdmin: event.params.baseParams[3],
    ipfsCID: event.params.baseParams[4],
    merkleRoot: event.params.baseParams[5],
    name: event.params.baseParams[6].replace(/\x00/g, ""),
    transferable: event.params.baseParams[7],
  } as const;

  let entity = {
    ...partial,
    expires: BigInt(params.expiration) !== 0n,
    expiration: BigInt(params.expiration),
    /** --------------- */
    admin: params.initialAdmin.toLowerCase(),
    lockup: event.params.lockupLinear.toLowerCase(),
    /** --------------- */
    name: params.name,
    root: params.merkleRoot,
    ipfsCID: params.ipfsCID,
    aggregateAmount: BigInt(event.params.aggregateAmount),
    totalRecipients: BigInt(event.params.recipientCount),
    /** --------------- */
    category: StreamCategory.LockupLinear,
    streamCliff: BigInt(event.params.streamDurations[0]) !== 0n,
    streamCliffDuration: BigInt(event.params.streamDurations[0]),
    streamTotalDuration: BigInt(event.params.streamDurations[1]),
    streamCancelable: params.cancelable,
    streamTransferable: params.transferable,

    version: StreamVersion.V22,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  const campaign: Campaign = {
    ...entity,
    ...partAsset,

    nickname: generateCampaignNickname(entity, asset),
  };

  return {
    campaign,
    watcher,
  };
}

export async function createLinearCampaign_V23(
  event: Event<CreateLinearArgs_V23>,
  entities: {
    asset: Asset;
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { asset, factory, watcher } = entities;

  const { entity: partial, ...post_create } = createCampaign(
    event,
    event.params.merkleLL,
    {
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  /** --------------- */

  const params = {
    asset: event.params.baseParams[0],
    cancelable: event.params.cancelable,
    expiration: event.params.baseParams[1],
    initialAdmin: event.params.baseParams[2],
    ipfsCID: event.params.baseParams[3],
    merkleRoot: event.params.baseParams[4],
    name: event.params.baseParams[5],
    transferable: event.params.transferable,
    shape: event.params.baseParams[6],
    fee: event.params.fee,
  } as const;

  let entity = {
    ...partial,
    expires: BigInt(params.expiration) !== 0n,
    expiration: BigInt(params.expiration),
    /** --------------- */
    admin: params.initialAdmin.toLowerCase(),
    lockup: event.params.lockup.toLowerCase(),
    /** --------------- */
    name: params.name,
    root: params.merkleRoot,
    ipfsCID: params.ipfsCID,
    aggregateAmount: BigInt(event.params.aggregateAmount),
    totalRecipients: BigInt(event.params.recipientCount),
    /** --------------- */
    category: StreamCategory.LockupLinear,
    streamCliff: BigInt(event.params.schedule[2]) !== 0n,
    streamCliffDuration: BigInt(event.params.schedule[2]),
    streamTotalDuration: BigInt(event.params.schedule[4]),
    streamCancelable: params.cancelable,
    streamTransferable: params.transferable,
    streamShape: params.shape,
    fee: params.fee,

    version: StreamVersion.V23,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  const campaign: Campaign = {
    ...entity,
    ...partAsset,

    nickname: generateCampaignNickname(entity, asset),
  };

  return {
    campaign,
    watcher,
  };
}

export async function createTranchedCampaign_V22(
  event: Event<CreateTranchedArgs_V22>,
  entities: {
    asset: Asset;
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { asset, factory, watcher } = entities;

  const { entity: partial, ...post_create } = createCampaign(
    event,
    event.params.merkleLT,
    {
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  /** --------------- */

  const params = {
    asset: event.params.baseParams[0],
    cancelable: event.params.baseParams[1],
    expiration: event.params.baseParams[2],
    initialAdmin: event.params.baseParams[3],
    ipfsCID: event.params.baseParams[4],
    merkleRoot: event.params.baseParams[5],
    name: event.params.baseParams[6],
    transferable: event.params.baseParams[7],
  } as const;

  let entity = {
    ...partial,
    expires: BigInt(params.expiration) !== 0n,
    expiration: BigInt(params.expiration),
    /** --------------- */
    admin: params.initialAdmin.toLowerCase(),
    lockup: event.params.lockupTranched.toLowerCase(),
    /** --------------- */
    name: params.name,
    root: params.merkleRoot,
    ipfsCID: params.ipfsCID,
    aggregateAmount: BigInt(event.params.aggregateAmount),
    totalRecipients: BigInt(event.params.recipientCount),
    /** --------------- */
    category: StreamCategory.LockupTranched,
    streamTotalDuration: BigInt(event.params.totalDuration),
    streamCancelable: params.cancelable,
    streamTransferable: params.transferable,

    version: StreamVersion.V22,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  /** Tranches: created, have to be saved */
  const tranches = createTranches(event, entity);

  /** --------------- */
  const campaign: Campaign = {
    ...entity,
    ...partAsset,

    nickname: generateCampaignNickname(entity, asset),
  };

  return {
    campaign,
    tranches,
    watcher,
  };
}

export async function createTranchedCampaign_V23(
  event: Event<CreateTranchedArgs_V23>,
  entities: {
    asset: Asset;
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { asset, factory, watcher } = entities;

  const { entity: partial, ...post_create } = createCampaign(
    event,
    event.params.merkleLT,
    {
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  /** --------------- */

  const params = {
    asset: event.params.baseParams[0],
    cancelable: event.params.cancelable,
    expiration: event.params.baseParams[1],
    initialAdmin: event.params.baseParams[2],
    ipfsCID: event.params.baseParams[3],
    merkleRoot: event.params.baseParams[4],
    name: event.params.baseParams[5],
    transferable: event.params.transferable,
    shape: event.params.baseParams[6],
    fee: event.params.fee,
  } as const;

  let entity = {
    ...partial,
    expires: BigInt(params.expiration) !== 0n,
    expiration: BigInt(params.expiration),
    /** --------------- */
    admin: params.initialAdmin.toLowerCase(),
    lockup: event.params.lockup.toLowerCase(),
    /** --------------- */
    name: params.name,
    root: params.merkleRoot,
    ipfsCID: params.ipfsCID,
    aggregateAmount: BigInt(event.params.aggregateAmount),
    totalRecipients: BigInt(event.params.recipientCount),
    /** --------------- */
    category: StreamCategory.LockupTranched,
    streamTotalDuration: BigInt(event.params.totalDuration),
    streamCancelable: params.cancelable,
    streamTransferable: params.transferable,
    streamShape: params.shape,
    fee: params.fee,

    version: StreamVersion.V23,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  /** Tranches: created, have to be saved */
  const tranches = createTranches(event, entity);

  /** --------------- */
  const campaign: Campaign = {
    ...entity,
    ...partAsset,

    nickname: generateCampaignNickname(entity, asset),
  };

  return {
    campaign,
    tranches,
    watcher,
  };
}

export async function createInstantCampaign_V23(
  event: Event<CreateInstantArgs_V23>,
  entities: {
    asset: Asset;
    factory: Factory;
    watcher: Watcher;
  },
) {
  let { asset, factory, watcher } = entities;

  const { entity: partial, ...post_create } = createCampaign(
    event,
    event.params.merkleInstant,
    {
      factory,
      watcher,
    },
  );

  watcher = post_create.watcher;

  /** --------------- */

  const params = {
    asset: event.params.baseParams[0],
    expiration: event.params.baseParams[1],
    initialAdmin: event.params.baseParams[2],
    ipfsCID: event.params.baseParams[3],
    merkleRoot: event.params.baseParams[4],
    name: event.params.baseParams[5],
    shape: event.params.baseParams[6],
    fee: event.params.fee,
  } as const;

  let entity = {
    ...partial,
    expires: BigInt(params.expiration) !== 0n,
    expiration: BigInt(params.expiration),
    /** --------------- */
    admin: params.initialAdmin.toLowerCase(),
    /** --------------- */
    name: params.name,
    root: params.merkleRoot,
    ipfsCID: params.ipfsCID,
    aggregateAmount: BigInt(event.params.aggregateAmount),
    totalRecipients: BigInt(event.params.recipientCount),
    /** --------------- */
    category: "Instant",
    streamShape: params.shape,
    fee: params.fee,

    version: StreamVersion.V23,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  const campaign: Campaign = {
    ...entity,
    ...partAsset,

    nickname: generateCampaignNickname(entity, asset),
  };

  return {
    campaign,
    watcher,
  };
}

export async function getCampaign(
  event: Event,
  loader: (id: string) => Promise<Campaign | undefined>,
) {
  const id = generateCampaignId(event, event.srcAddress);
  const loaded = await loader(id);

  if (loaded === undefined) {
    throw new Error("Missing campaign instance");
  }

  return loaded;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateCampaignNickname(
  campaign: Pick<Campaign, "admin" | "name" | "version">,
  asset: Asset,
): string {
  if (campaign.version === StreamVersion.V21) {
    let prefix = campaign.admin.slice(0, 6);
    let suffix = campaign.admin.slice(-4);

    return `${asset.symbol} by ${prefix}..${suffix}`;
  } else {
    return `${asset.symbol} in ${campaign.name || ""}`;
  }
}

export function generateCampaignId(event: Event, address: Address) {
  let id = ""
    .concat(address.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());

  return id;
}
