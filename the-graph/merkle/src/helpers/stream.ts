import type { Bytes, BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import { getChainId } from "../constants";

export function generateStreamId(contract: Bytes, tokenId: GraphBigInt): string {
  const id = ""
    .concat(contract.toHexString())
    .concat("-")
    .concat(getChainId().toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}
