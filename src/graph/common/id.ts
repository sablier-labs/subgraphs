import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { readChainId, readContractAlias } from "./context";

export namespace Id {
  /**
   * Note that the `logIndex` is the index of the log in the block, not in the transaction.
   * @see https://ethereum.stackexchange.com/q/168867/24693
   *
   * @example
   * 137-0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35-3
   */
  export function action(event: ethereum.Event): string {
    const chainId = readChainId().toString();
    const hash = event.transaction.hash.toHexString();
    const index = event.logIndex.toString();
    return `${chainId}-${hash}-${index}`;
  }

  /**
   * @example
   * 137-0x2791bca1f2de4661ed88a30c99a7a9449aa84174
   */
  export function asset(assetAddress: Address): string {
    const chainId = readChainId().toString();
    const address = assetAddress.toHexString();
    return `${chainId}-${address}`;
  }

  /**
   * @example
   * 137-0xf50760d8ead9ff322631a1f3ebf26cc7891b3708-0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35
   */
  export function batch(event: ethereum.Event, sender: Address): string {
    const chainId = readChainId().toString();
    const address = sender.toHexString();
    const hash = event.transaction.hash.toHexString();
    return `${chainId}-${address}-${hash}`;
  }

  /**
   * @example
   * 137-0x5ce95bff1297dadbdcf9929a10bd02bdfab0dcc6
   */
  export function batcher(sender: Address): string {
    const chainId = readChainId().toString();
    const address = sender.toHexString();
    return `${chainId}-${address}`;
  }

  /**
   * The ID starts with the address due to historical reasons.
   * @see https://github.com/sablier-labs/indexers/discussions/118
   *
   * @example
   * 0xf50760d8ead9ff322631a1f3ebf26cc7891b3708-137
   */
  export function campaign(campaignAddress: Address): string {
    const chainId = readChainId().toString();
    const address = campaignAddress.toHexString();
    return `${address}-${chainId}`;
  }

  /**
   * @example
   * 137-0xf0d61b42311c810dfde191d58427d81e87c5d5f6
   */
  export function factory(factoryAddress: Address): string {
    const chainId = readChainId().toString();
    const address = factoryAddress.toHexString();
    return `${chainId}-${address}`;
  }

  /**
   * The ID starts with the address due to historical reasons.
   * @see https://github.com/sablier-labs/indexers/discussions/118
   *
   * @example
   * 0xe0bfe071da104e571298f8b6e0fce44c512c1ff4-137-42
   */
  export function stream(contractAddress: Address, tokenId: BigInt): string {
    const address = contractAddress.toHexString();
    const chainId = readChainId().toString();
    const streamId = `${address}-${chainId}-${tokenId.toString()}`;
    return streamId;
  }

  /**
   * @example
   * LK-137-42
   */
  export function streamAlias(chainId: BigInt, tokenId: BigInt): string {
    const alias = readContractAlias();
    return `${alias}-${chainId.toString()}-${tokenId.toString()}`;
  }
}
