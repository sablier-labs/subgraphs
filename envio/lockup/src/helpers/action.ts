import type { Action, Event, Mutable, Watcher } from "../types";
import { generateContractIdFromEvent } from "./contract";

type Entity = Partial<Mutable<Action>>;

export async function getAction(
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
    block: BigInt(event.block.number),
    from: event.transaction.from?.toLowerCase() || "",
    hash: event.transaction.hash,
    timestamp: BigInt(event.block.timestamp),
    subgraphId: BigInt(watcher_.actionIndex),
    chainId: BigInt(event.chainId),
    contract_id: generateContractIdFromEvent(event),
    fee: event.transaction.value,
    /** --------------- */
    addressA: undefined,
    addressB: undefined,
    amountA: undefined,
    amountB: undefined,
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
    .concat(event.transaction.hash)
    .concat("-")
    .concat(event.logIndex.toString())
    .concat("-")
    .concat(event.chainId.toString());
}
