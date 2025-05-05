import { BigInt as BInt, dataSource } from "@graphprotocol/graph-ts";
import { logAndExit } from "./exit";

export function getChainId(): BInt {
  const context = dataSource.context();
  const chainId = context.get("chainId");
  if (chainId == null) {
    logAndExit("chainId not found in context", []);
  }
  return chainId.toBigInt();
}
