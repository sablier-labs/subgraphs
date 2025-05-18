import type { Address, Event } from "./bindings";

export namespace Id {
  /**
   * Note that the `logIndex` is the index of the log in the block, not in the transaction.
   * @see https://ethereum.stackexchange.com/q/168867/24693
   *
   * @example
   * 0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35-3
   */
  export function action(event: Event): string {
    return `${event.transaction.hash}-${event.logIndex}`;
  }

  /**
   * @example
   * 0x2791bca1f2de4661ed88a30c99a7a9449aa84174-137
   */
  export function asset(assetAddress: string, chainId: number): string {
    return `${assetAddress}-${chainId}`;
  }

  /**
   * @example
   * 137-0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35-0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6
   */
  export function batch(event: Event, sender: Address): string {
    return `${event.chainId}-${event.transaction.hash}-${sender}`;
  }

  /**
   * @example
   * 137-0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6-0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6
   */
  export function batcher(event: Event, sender: Address): string {
    return `${event.chainId}-${sender}`;
  }

  /**
   * @example
   * 0xe0bfe071da104e571298f8b6e0fce44c512c1ff4-137-42
   */
  export function stream(contractAddress: Address, chainId: number, tokenId: bigint | string): string {
    return `${contractAddress}-${chainId}-${tokenId}`;
  }

  /**
   * @example
   * LK-137-42
   */
  export function streamAlias(contractAlias: Address, chainId: number, tokenId: bigint): string {
    return `${contractAlias}-${chainId}-${tokenId}`;
  }
}
