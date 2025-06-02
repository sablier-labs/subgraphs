import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
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
   * 0x2791bca1f2de4661ed88a30c99a7a9449aa84174-137
   */
  export function asset(assetAddress: Address): string {
    const address = assetAddress.toHexString();
    const chainId = readChainId().toString();
    return `${address}-${chainId}`;
  }

  /**
   * @example
   * 0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35-0xf50760d8ead9ff322631a1f3ebf26cc7891b3708
   */
  export function batch(hash: Bytes, address: Address): string {
    return `${hash.toHexString()}-${address.toHexString()}`;
  }

  /**
   * @example
   * 0xf50760d8ead9ff322631a1f3ebf26cc7891b3708-137
   */
  export function campaign(campaignAddress: Address): string {
    const address = campaignAddress.toHexString();
    const chainId = readChainId().toString();
    return `${address}-${chainId}`;
  }

  /**
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
