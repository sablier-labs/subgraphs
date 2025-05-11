import { BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { getChainId, getContractAlias } from "./context";

/**
 * @example
 * 0xe43d1bc5e868da0bd1d80c404ca7f41e823bbea03488f8e3878327375b3aac35-1
 */
export function getActionId(event: ethereum.Event): string {
  const hash = event.transaction.hash.toHexString();
  const index = event.logIndex.toString();
  return hash + "-" + index;
}

/**
 * @example
 * 0xe0bfe071da104e571298f8b6e0fce44c512c1ff4-137-42
 */
export function getStreamId(tokenId: BigInt): string {
  const address = dataSource.address().toHexString();
  const chainId = getChainId().toString();
  const streamId = address + "-" + chainId + "-" + tokenId.toString();
  return streamId;
}

/**
 * @example
 * LK-137-42
 */
export function getStreamAlias(tokenId: BigInt): string {
  const chainId = getChainId().toString();
  return getContractAlias() + "-" + chainId + "-" + tokenId.toString();
}
