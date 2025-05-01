import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { getChainId } from "../constants";

export function generateStreamId(contract: Bytes, tokenId: BigInt): string {
  let id = ""
    .concat(contract.toHexString())
    .concat("-")
    .concat(getChainId().toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}
