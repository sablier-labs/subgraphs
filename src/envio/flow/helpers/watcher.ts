import type { Event } from "../../common/types";
import type { Watcher } from "../bindings";

export async function initialize(
  event: Event,
  loaderWatcher: (id: string) => Promise<Watcher | undefined>,
  loaded?: { watcher?: Watcher },
) {
  const watcher = loaded?.watcher ?? (await getOrCreateWatcher(event, loaderWatcher));

  if (watcher.initialized) {
    try {
      return {
        watcher,
      };
    } catch (_error) {
      console.log("Initializing");
    }
  }

  return {
    watcher: {
      ...watcher,
    },
  };
}

function createWatcher(event: Event): Watcher {
  const entity: Watcher = {
    id: event.chainId.toString(),
    chainId: BigInt(event.chainId),
    actionIndex: 1n,
    streamIndex: 1n,
    initialized: false,
    logs: [],
  };

  return entity;
}

export async function getOrCreateWatcher(event: Event, loader: (id: string) => Promise<Watcher | undefined>) {
  const watcher = await loader(event.chainId.toString());

  if (watcher === undefined) {
    return createWatcher(event);
  }

  return watcher;
}
