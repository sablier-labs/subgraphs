import type {
  Address,
  Asset,
  Batch,
  Batcher,
  Contract,
  Event,
  Mutable,
  Stream,
  Watcher,
  CreateDynamicArgs,
  CreateLinearArgs,
  CreateTranchedArgs,
  CreateDynamicMergedArgs,
  CreateLinearMergedArgs,
  CreateTranchedMergedArgs,
} from "../types";

import { StreamCategory, StreamVersion, configuration } from "../constants";
import { createSegments } from "./segments";
import { createTranches } from "./tranches";
import { bindProxy } from "./proxy";

type Entity = Partial<Mutable<Stream>>;

function createStream(
  event: Event,
  tokenId: bigint,
  entities: {
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { batch, batcher, contract, watcher } = entities;

  const id = generateStreamId(event, contract.address, tokenId);
  const alias = generateStreamAlias(event, contract.address, tokenId);

  /** --------------- */

  const entity = {
    id,
    tokenId,
    alias,
    contract_id: contract.id,
    version: contract.version,
    subgraphId: BigInt(watcher.streamIndex),
    hash: event.transaction.hash.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    chainId: BigInt(event.chainId),

    /** --------------- */

    cliff: false,
    initial: false,
    proxied: false,
    canceled: false,
    transferable: true,

    renounceAction_id: undefined,
    canceledAction_id: undefined,
    cliffAmount: undefined,
    withdrawnAmount: 0n,
    initialAmount: undefined,

    canceledTime: undefined,
    cliffTime: undefined,
    renounceTime: undefined,
    shape: undefined,

    /** --------------- */
    batch_id: batch.id,
    position: BigInt(batch.size),
  } satisfies Entity;

  /** --------------- */

  watcher = {
    ...watcher,
    streamIndex: BigInt(watcher.streamIndex) + 1n,
  };

  /** --------------- */

  const post_batch = (() => {
    const size = BigInt(batch.size) + 1n;

    if (batch.size === 1n && !batch.label) {
      /**
       * If the batch already has its first element (now adding the second),
       * assign it a label and bump the batcher's index
       */
      const index = BigInt(batcher.batchIndex) + 1n;
      const label = index.toString();

      return {
        batch: {
          ...batch,
          label,
          size,
        },
        batcher: {
          ...batcher,
          batchIndex: index,
        },
      };
    }

    return {
      batch: {
        ...batch,
        size,
      },
      batcher,
    };
  })();

  batch = post_batch.batch;
  batcher = post_batch.batcher;

  return {
    entity,
    batch,
    batcher,
    watcher,
  };
}

export async function createDynamicStream(
  event: Event<CreateDynamicArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;

  const { entity: partial, ...post_create } = createStream(
    event,
    event.params.streamId,
    {
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  /** -------------- */

  const timestamps = (() => {
    if (
      contract.version == StreamVersion.V20 ||
      contract.version == StreamVersion.V21
    ) {
      if ("range" in event.params) {
        return {
          startTime: BigInt(event.params.range[0]),
          endTime: BigInt(event.params.range[1]),
          duration:
            BigInt(event.params.range[1]) - BigInt(event.params.range[0]),
        };
      }
    }

    if ("timestamps" in event.params) {
      return {
        startTime: BigInt(event.params.timestamps[0]),
        endTime: BigInt(event.params.timestamps[1]),
        duration:
          BigInt(event.params.timestamps[1]) -
          BigInt(event.params.timestamps[0]),
      };
    }

    throw new Error("Missing time component in create event");
  })() satisfies Entity;

  /** --------------- */

  let entity = {
    ...partial,
    ...timestamps,
    category: StreamCategory.LockupDynamic,
    funder: event.params.funder.toLowerCase(),
    sender: event.params.sender.toLowerCase(),
    recipient: event.params.recipient.toLowerCase(),
    parties: [
      event.params.sender.toLowerCase(),
      event.params.recipient.toLowerCase(),
    ],

    cliff: false,
    cliffAmount: undefined,
    cliffTime: undefined,

    depositAmount: BigInt(event.params.amounts[0]),
    intactAmount: BigInt(event.params.amounts[0]),

    cancelable: event.params.cancelable,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** -------------- */
  const partFees = (() => {
    if (
      contract.version == StreamVersion.V20 ||
      contract.version == StreamVersion.V21
    ) {
      if (event.params.amounts.length === 3) {
        return {
          protocolFeeAmount: BigInt(event.params.amounts[1]),
          brokerFeeAmount: BigInt(event.params.amounts[2]),
        };
      }
    }

    return {
      protocolFeeAmount: BigInt(0),
      brokerFeeAmount: BigInt(event.params.amounts[1]),
    };
  })() satisfies Entity;

  /** --------------- */
  /** Batch: managed by the base creator method (downstream) */

  /** --------------- */
  /** Segments: created, have to be saved */
  const segments = createSegments(event, entity);

  /** --------------- */
  const partProxy = await bindProxy(entity);

  /** --------------- */
  const partTransferable = {
    transferable:
      "transferable" in event.params
        ? event.params.transferable
        : entity.transferable,
  };

  /** --------------- */
  const stream: Stream = {
    ...entity,
    ...partAsset,
    ...partFees,
    ...partProxy,
    ...partTransferable,
  };

  return {
    batch,
    batcher,
    stream,
    segments,
    watcher,
  };
}

export async function createDynamicMergedStream(
  event: Event<CreateDynamicMergedArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;

  const { entity: partial, ...post_create } = createStream(
    event,
    event.params.streamId,
    {
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  /** -------------- */

  const timestamps = (() => {
    return {
      startTime: BigInt(event.params.commonParams[7][0]),
      endTime: BigInt(event.params.commonParams[7][1]),
      duration:
        BigInt(event.params.commonParams[7][1]) -
        BigInt(event.params.commonParams[7][0]),
    };
  })() satisfies Entity;

  /** --------------- */

  let entity = {
    ...partial,
    ...timestamps,
    category: StreamCategory.LockupDynamic,
    funder: event.params.commonParams[0].toLowerCase(),
    sender: event.params.commonParams[1].toLowerCase(),
    recipient: event.params.commonParams[2].toLowerCase(),
    parties: [
      event.params.commonParams[1].toLowerCase(),
      event.params.commonParams[2].toLowerCase(),
    ],

    cliff: false,
    cliffAmount: undefined,
    cliffTime: undefined,

    depositAmount: BigInt(event.params.commonParams[3][0]),
    intactAmount: BigInt(event.params.commonParams[3][0]),

    cancelable: event.params.commonParams[5],
    transferable: event.params.commonParams[6],
    shape: event.params.commonParams[8].replace(/\x00/g, ""),
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** -------------- */
  const partFees = (() => {
    return {
      protocolFeeAmount: BigInt(0),
      brokerFeeAmount: BigInt(event.params.commonParams[3][1]),
    };
  })() satisfies Entity;

  /** --------------- */
  /** Segments: created, have to be saved */
  const segments = createSegments(event, entity);

  /** --------------- */
  const partProxy = await bindProxy(entity);

  /** --------------- */
  const stream: Stream = {
    ...entity,
    ...partAsset,
    ...partFees,
    ...partProxy,
  };

  return {
    batch,
    batcher,
    stream,
    segments,
    watcher,
  };
}

export async function createLinearStream(
  event: Event<CreateLinearArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;

  const { entity: partial, ...post_create } = createStream(
    event,
    event.params.streamId,
    {
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  /** -------------- */

  const timestamps = (() => {
    if (
      contract.version == StreamVersion.V20 ||
      contract.version == StreamVersion.V21
    ) {
      if ("range" in event.params) {
        return {
          cliffTime: BigInt(event.params.range[1]),
          startTime: BigInt(event.params.range[0]),
          endTime: BigInt(event.params.range[2]),
          duration:
            BigInt(event.params.range[2]) - BigInt(event.params.range[0]),
        };
      }
    }

    if ("timestamps" in event.params) {
      return {
        cliffTime: BigInt(event.params.timestamps[1]),
        startTime: BigInt(event.params.timestamps[0]),
        endTime: BigInt(event.params.timestamps[2]),
        duration:
          BigInt(event.params.timestamps[2]) -
          BigInt(event.params.timestamps[0]),
      };
    }

    throw new Error("Missing time component in create event");
  })() satisfies Entity;

  /** --------------- */

  let entity = {
    ...partial,
    category: StreamCategory.LockupLinear,
    funder: event.params.funder.toLowerCase(),
    sender: event.params.sender.toLowerCase(),
    recipient: event.params.recipient.toLowerCase(),
    parties: [
      event.params.sender.toLowerCase(),
      event.params.recipient.toLowerCase(),
    ],

    depositAmount: BigInt(event.params.amounts[0]),
    intactAmount: BigInt(event.params.amounts[0]),

    cancelable: event.params.cancelable,

    startTime: timestamps.startTime,
    endTime: timestamps.endTime,
    duration: timestamps.duration,
  } satisfies Entity;

  /** --------------- */
  const partCliff = (() => {
    const deposit = BigInt(entity.depositAmount);
    const cliffTime = BigInt(timestamps.cliffTime);
    let cliff = BigInt(cliffTime) - BigInt(entity.startTime);

    if (
      contract.version != StreamVersion.V21 &&
      contract.version != StreamVersion.V20
    ) {
      if (cliffTime == 0n) {
        cliff = 0n;
      }
    }

    if (cliff !== 0n) {
      return {
        cliff: true,
        cliffAmount:
          (BigInt(deposit) * BigInt(cliff)) / BigInt(entity.duration),
        cliffTime,
      };
    }

    return {
      cliff: false,
      cliffAmount: undefined,
      cliffTime: undefined,
    };
  })() satisfies Entity;

  /** -------------- */
  const partFees = (() => {
    if (
      contract.version == StreamVersion.V20 ||
      contract.version == StreamVersion.V21
    ) {
      if (event.params.amounts.length === 3) {
        return {
          protocolFeeAmount: BigInt(event.params.amounts[1]),
          brokerFeeAmount: BigInt(event.params.amounts[2]),
        };
      }
    }

    return {
      protocolFeeAmount: BigInt(0),
      brokerFeeAmount: BigInt(event.params.amounts[1]),
    };
  })() satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  /** Batch: managed by the base creator method (downstream) */

  /** --------------- */
  const partProxy = await bindProxy(entity);

  /** --------------- */
  const partTransferable = {
    transferable:
      "transferable" in event.params
        ? event.params.transferable
        : entity.transferable,
  };

  /** --------------- */
  const stream: Stream = {
    ...entity,
    ...partAsset,
    ...partCliff,
    ...partFees,
    ...partProxy,
    ...partTransferable,
  };

  return {
    batch,
    batcher,
    stream,
    watcher,
  };
}

export async function createLinearMergedStream(
  event: Event<CreateLinearMergedArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;

  const { entity: partial, ...post_create } = createStream(
    event,
    event.params.streamId,
    {
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  /** -------------- */

  const timestamps = (() => {
    return {
      cliffTime: BigInt(event.params.cliffTime),
      startTime: BigInt(event.params.commonParams[7][0]),
      endTime: BigInt(event.params.commonParams[7][1]),
      duration:
        BigInt(event.params.commonParams[7][1]) -
        BigInt(event.params.commonParams[7][0]),
    };
  })() satisfies Entity;

  /** --------------- */

  let entity = {
    ...partial,
    category: StreamCategory.LockupLinear,
    funder: event.params.commonParams[0].toLowerCase(),
    sender: event.params.commonParams[1].toLowerCase(),
    recipient: event.params.commonParams[2].toLowerCase(),
    parties: [
      event.params.commonParams[1].toLowerCase(),
      event.params.commonParams[2].toLowerCase(),
    ],

    depositAmount: BigInt(event.params.commonParams[3][0]),
    intactAmount: BigInt(event.params.commonParams[3][0]),

    cancelable: event.params.commonParams[5],
    transferable: event.params.commonParams[6],

    startTime: timestamps.startTime,
    endTime: timestamps.endTime,
    duration: timestamps.duration,
    shape: event.params.commonParams[8].replace(/\x00/g, ""),
  } satisfies Entity;

  /** --------------- */
  const partCliff = (() => {
    const cliffTime = BigInt(timestamps.cliffTime);

    if (cliffTime !== 0n) {
      return {
        cliff: true,
        cliffAmount: event.params.unlockAmounts[1],
        cliffTime,
      };
    }

    return {
      cliff: false,
      cliffAmount: undefined,
      cliffTime: undefined,
    };
  })() satisfies Entity;

  /** -------------- */
  const partFees = (() => {
    return {
      protocolFeeAmount: BigInt(0),
      brokerFeeAmount: BigInt(event.params.commonParams[3][1]),
    };
  })() satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  /** Batch: managed by the base creator method (downstream) */

  /** --------------- */
  const partProxy = await bindProxy(entity);

  /** --------------- */
  const stream: Stream = {
    ...entity,
    ...partAsset,
    ...partCliff,
    ...partFees,
    ...partProxy,
  };

  return {
    batch,
    batcher,
    stream,
    watcher,
  };
}

export async function createTranchedStream(
  event: Event<CreateTranchedArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;

  const { entity: partial, ...post_create } = createStream(
    event,
    event.params.streamId,
    {
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  /** -------------- */

  const timestamps = (() => {
    return contract.version == StreamVersion.V22
      ? {
          startTime: BigInt(event.params.timestamps[0]),
          endTime: BigInt(event.params.timestamps[1]),
          duration:
            BigInt(event.params.timestamps[1]) -
            BigInt(event.params.timestamps[0]),
        }
      : {
          startTime: BigInt(event.params.timestamps[0]),
          endTime: BigInt(event.params.timestamps[1]),
          duration:
            BigInt(event.params.timestamps[1]) -
            BigInt(event.params.timestamps[0]),
        };
  })() satisfies Entity;

  /** --------------- */

  let entity = {
    ...partial,
    ...timestamps,
    category: StreamCategory.LockupTranched,
    funder: event.params.funder.toLowerCase(),
    sender: event.params.sender.toLowerCase(),
    recipient: event.params.recipient.toLowerCase(),
    parties: [
      event.params.sender.toLowerCase(),
      event.params.recipient.toLowerCase(),
    ],

    cliff: false,
    cliffAmount: undefined,
    cliffTime: undefined,

    depositAmount: BigInt(event.params.amounts[0]),
    intactAmount: BigInt(event.params.amounts[0]),
    protocolFeeAmount: BigInt(0),
    brokerFeeAmount: BigInt(event.params.amounts[1]),

    cancelable: event.params.cancelable,
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  /** Batch: managed by the base creator method (downstream) */

  /** --------------- */
  /** Tranches: created, have to be saved */
  const tranches = createTranches(event, entity);

  /** --------------- */
  const partProxy = await bindProxy(entity);

  /** --------------- */
  const partTransferable = {
    transferable:
      "transferable" in event.params
        ? event.params.transferable
        : entity.transferable,
  };

  /** --------------- */
  const stream: Stream = {
    ...entity,
    ...partAsset,
    ...partProxy,
    ...partTransferable,
  };

  return {
    batch,
    batcher,
    stream,
    tranches,
    watcher,
  };
}

export async function createTranchedMergedStream(
  event: Event<CreateTranchedMergedArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;

  const { entity: partial, ...post_create } = createStream(
    event,
    event.params.streamId,
    {
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  /** -------------- */

  const timestamps = (() => {
    return {
      startTime: BigInt(event.params.commonParams[7][0]),
      endTime: BigInt(event.params.commonParams[7][1]),
      duration:
        BigInt(event.params.commonParams[7][1]) -
        BigInt(event.params.commonParams[7][0]),
    };
  })() satisfies Entity;

  /** --------------- */

  let entity = {
    ...partial,
    ...timestamps,
    category: StreamCategory.LockupTranched,
    funder: event.params.commonParams[0].toLowerCase(),
    sender: event.params.commonParams[1].toLowerCase(),
    recipient: event.params.commonParams[2].toLowerCase(),
    parties: [
      event.params.commonParams[1].toLowerCase(),
      event.params.commonParams[2].toLowerCase(),
    ],

    cliff: false,
    cliffAmount: undefined,
    cliffTime: undefined,

    protocolFeeAmount: BigInt(0),
    brokerFeeAmount: BigInt(event.params.commonParams[3][1]),

    depositAmount: BigInt(event.params.commonParams[3][0]),
    intactAmount: BigInt(event.params.commonParams[3][0]),

    cancelable: event.params.commonParams[5],
    transferable: event.params.commonParams[6],
    shape: event.params.commonParams[8].replace(/\x00/g, ""),
  } satisfies Entity;

  /** --------------- */
  /** Asset: managed by the event handler (upstream) */
  const partAsset = { asset_id: asset.id } satisfies Entity;

  /** --------------- */
  /** Batch: managed by the base creator method (downstream) */

  /** --------------- */
  /** Tranches: created, have to be saved */
  const tranches = createTranches(event, entity);

  /** --------------- */
  const partProxy = await bindProxy(entity);

  /** --------------- */
  const stream: Stream = {
    ...entity,
    ...partAsset,
    ...partProxy,
  };

  return {
    batch,
    batcher,
    stream,
    tranches,
    watcher,
  };
}

export async function getStream(
  event: Event,
  tokenId: bigint | string,
  loader: (id: string) => Promise<Stream | undefined>,
) {
  const id = generateStreamId(event, event.srcAddress, tokenId);
  const stream = await loader(id);

  if (!stream) {
    throw new Error("Missing stream instance");
  }

  return stream;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateStreamId(
  event: Event,
  address: Address,
  tokenId: bigint | string,
) {
  let id = ""
    .concat(address.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function generateStreamAlias(
  event: Event,
  address: Address,
  tokenId: bigint,
) {
  const chain = configuration(event.chainId);
  const contract = chain.contracts.find(
    (c) => c.address === address.toLowerCase(),
  );

  if (!contract) {
    throw new Error("Missing or mismatched contract in configuration");
  }

  let id = ""
    .concat(contract.alias.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}
