import type { Event } from "./bindings";

/**
 * Utility object for generating consistent ID strings for various entities
 */
export const ids = {
  /**
   * @example
   * 0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35-3
   */
  action(event: Event): string {
    return `${event.transaction.hash}-${event.logIndex}`;
  },

  /**
   * @example
   * 0x2791bca1f2de4661ed88a30c99a7a9449aa84174-137
   */
  asset(assetAddress: string, chainId: number): string {
    return `${assetAddress}-${chainId}`;
  },

  /**
   * @example
   * 0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6-137
   */
  batch(event: Event): string {
    return `${event.transaction.hash}-${event.chainId}`;
  },

  /**
   * @example
   * 0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6-137
   */
  batcher(event: Event, sender: string): string {
    return `${sender}-${event.chainId}`;
  },

  /**
   * @example
   * 0xe0bfe071da104e571298f8b6e0fce44c512c1ff4-137-42
   */
  stream(contractAddress: string, chainId: number, tokenId: bigint | string): string {
    return `${contractAddress}-${chainId}-${tokenId}`;
  },

  /**
   * @example
   * LK-137-42
   */
  streamAlias(contractAlias: string, chainId: number, tokenId: bigint | string): string {
    return `${contractAlias}-${chainId}-${tokenId}`;
  },
};
