import { BigInt as BInt, Bytes } from "@graphprotocol/graph-ts";
import { getChainId } from "../../getters";

// TODO: add example
export function generateStreamIdWithContract(tokenId: BInt, contract: Bytes): string {
  const addr = contract.toHexString();
  const chainId = getChainId().toString();
  return `${addr}-${chainId}-${tokenId.toString()}`;
}
