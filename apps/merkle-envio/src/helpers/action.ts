import { ADDRESS_ZERO } from "../constants";
import type { Action, Event, Mutable, Watcher } from "../types";

type Entity = Partial<Mutable<Action>>;

export function getAction(
  event: Event,
  loader: (id: string) => Action | undefined,
) {
  const id = generateActionId(event);
  const loaded = loader(id);

  if (!loaded) {
    throw new Error("Missing action instance");
  }

  return loaded;
}

export async function getAction_async(
  event: Event,
  loader: (id: string) => Promise<Action | undefined>,
) {
  const id = generateActionId(event);
  const loaded = await loader(id);

  if (!loaded) {
    throw new Error("Missing action instance");
  }

  return loaded;
}

export function createAction(event: Event, watcher_: Watcher) {
  const id = generateActionId(event);

  const entity = {
    id,
    block: BigInt(event.blockNumber),
    from: ADDRESS_ZERO, // TODO missing event.transaction.from
    hash: event.transactionHash.toLowerCase(),
    timestamp: BigInt(event.blockTimestamp),
    subgraphId: watcher_.actionIndex,
    chainId: BigInt(event.chainId),
    /** --------------- */
    claimStreamId: null,
    claimTokenId: 0n,
    claimAmount: 0n,
    claimIndex: 0n,
    claimRecipient: null,

    clawbackAmount: 0n,
    clawbackFrom: null,
    clawbackTo: null,
  } satisfies Entity;

  const watcher: Watcher = {
    ...watcher_,
    actionIndex: BigInt(watcher_.actionIndex) + 1n,
  };

  return {
    entity,
    watcher,
  };
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActionId(event: Event) {
  return ""
    .concat(event.transactionHash)
    .concat("-")
    .concat(event.chainId.toString())
    .concat("-")
    .concat(event.logIndex.toString());
}