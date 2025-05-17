/**
 * @see {@link file://./../../types.ts}
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest/#data-source-context
 */
import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { shutDown } from "./logger";

export function getChainId(): BigInt {
  return getBigInt("chainId");
}

export function getContractAlias(): string {
  return getString("alias");
}

export function getContractVersion(): string {
  return getString("version");
}

/**
 * @todo check if this is the correct way of loading a List type
 * @see https://github.com/graphprotocol/graph-tooling/discussions/2025
 */
export function getLockups(): string[] {
  return getStringArray("lockups");
}

function getBigInt(key: string): BigInt {
  const context = dataSource.context();
  const value = context.getBigInt(key);
  return value;
}

function getString(key: string): string {
  const context = dataSource.context();
  const value = context.getString(key);
  return value;
}

function getStringArray(key: string): string[] {
  const context = dataSource.context();
  const value = context.get(key);
  if (value == null) {
    shutDown("{} not found in data source context: {}", [key, dataSource.address().toHexString()]);
    return [];
  }
  return value.toStringArray();
}
