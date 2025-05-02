import type { Address, Event } from "../types";

export function generateStreamId(event: Event, lockup: Address, tokenId: bigint | string) {
  const id = ""
    .concat(lockup.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}
