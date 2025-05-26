import type { Common } from "@envio-common/bindings";

export function create<TWatcher extends Common.StreamWatcher>(chainId: number): TWatcher {
  const watcher: Common.StreamWatcher = {
    actionCounter: 0n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
    streamCounter: 0n,
  };

  return watcher as TWatcher;
}
