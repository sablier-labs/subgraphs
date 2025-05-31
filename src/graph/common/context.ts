/**
 * @see {@link file://./../../types.ts}
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/#data-source-context
 */
import { BigInt, dataSource, } from "@graphprotocol/graph-ts";
import { logDebug, shutDown } from "./logger";

export function readChainId(): BigInt {
  return readBigInt("chainId");
}

export function readContractAlias(): string {
  return readString("alias");
}

export function readContractVersion(): string {
  return readString("version");
}

/**
 * @todo check if this is the correct way of loading a List type
 * @see https://github.com/graphprotocol/graph-tooling/discussions/2025
 */
export function readLockups(): string[] {
  const context = dataSource.context();
  const value = context.get("lockups");
  if (value === null) {
    shutDown("Lockups not found in data source context: {}", [dataSource.address().toHexString()]);
    return [];
  }
  const lockups = changetype<string[]>(value.toArray());
  logDebug("lockups[0]: {}", [lockups[0]]);
  return lockups;
}

function readBigInt(key: string): BigInt {
  const context = dataSource.context();
  const value = context.getBigInt(key);
  return value;
}

function readString(key: string): string {
  const context = dataSource.context();
  const value = context.getString(key);
  return value;
}
