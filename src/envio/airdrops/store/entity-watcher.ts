import type { Entity } from "../bindings";

export function create(chainId: number): Entity.Watcher {
  const watcher: Entity.Watcher = {
    actionCounter: 1n,
    campaignCounter: 1n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
  };

  return watcher;
}
