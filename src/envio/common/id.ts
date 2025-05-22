import type { Address, Event } from "./bindings";

export namespace Id {
  /**
   * We can generate the campaign ID using the `event` because all activities are created within
   * the context of a campaign.
   *
   * @example
   * activity-0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6-137-20300
   */
  export function activity(event: Event): string {
    const campaignId = campaign(event.chainId, event.srcAddress);
    const timestamp = event.block.timestamp;
    const day = timestamp / (60 * 60 * 24); // 60 seconds * 60 minutes * 24 hours
    return `activity-${campaignId}-${day}`;
  }

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
  export function batcher(chainId: number, sender: Address): string {
    return `${chainId}-${sender}`;
  }

  /**
   * @example
   * 0xf50760d8ead9ff322631a1f3ebf26cc7891b3708-137
   */
  export function campaign(chainId: number, campaignAddress: Address): string {
    return `${campaignAddress}-${chainId}`;
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
