/**
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/#data-source-context
 */
import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { ZERO } from "./constants";
import { logAndExit } from "./logger";

export function getChainId(): BigInt {
  const context = dataSource.context();
  const chainId = context.get("chainId");
  if (chainId == null) {
    logAndExit("chainId not found in data source context: {}", [dataSource.address().toHexString()]);
    return ZERO; // execution will be halted by `logAndExit`
  }
  return chainId.toBigInt();
}

export function getContractAlias(): string {
  const context = dataSource.context();
  const alias = context.get("alias");
  if (alias == null) {
    logAndExit("alias not found in data source context: {}", [dataSource.address().toHexString()]);
    return ""; // execution will be halted by `logAndExit`
  }
  return alias.toString();
}

export function getContractVersion(): string {
  const context = dataSource.context();
  const version = context.get("version");
  if (version == null) {
    logAndExit("version not found in data source context: {}", [dataSource.address().toHexString()]);
    return ""; // execution will be halted by `logAndExit`
  }
  return version.toString();
}
