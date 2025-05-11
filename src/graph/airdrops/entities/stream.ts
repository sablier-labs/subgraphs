import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { getChainId } from "../../context";

// TODO: add example
export function generateStreamIdWithContract(tokenId: BigInt, contract: Bytes): string {
  const addr = contract.toHexString();
  const chainId = getChainId().toString();
  return addr + "-" + chainId + "-" + tokenId.toString();
}
