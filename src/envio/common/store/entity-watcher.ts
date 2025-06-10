import type { Common } from "../bindings";

export async function create<
  TContext extends { Watcher: { set: (watcher: TWatcher) => void | Promise<void> } },
  TWatcher extends Common.StreamWatcher,
>(context: TContext, chainId: number): Promise<TWatcher> {
  const watcher: Common.StreamWatcher = {
    actionCounter: 0n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
    streamCounter: 0n,
  };
  await context.Watcher.set(watcher as TWatcher);
  return watcher as TWatcher;
}
