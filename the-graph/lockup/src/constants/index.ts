import { Bytes, BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import {
  chainId,
  dynamic,
  initializer_lockup as initializer,
  linear,
  merged,
  registry,
  tranched,
} from "../generated/env";

export const zero = GraphBigInt.fromI32(0);
export const one = GraphBigInt.fromI32(1);
export const two = GraphBigInt.fromI32(2);
export const d18 = GraphBigInt.fromI32(18);

export const ADDRESS_ZERO = Bytes.fromHexString("0x0000000000000000000000000000000000000000");

export const StreamVersion_V20 = "V20";
export const StreamVersion_V21 = "V21";
export const StreamVersion_V22 = "V22";
export const StreamVersion_V23 = "V23";

export function getContractInitializer(): string {
  return initializer.toLowerCase();
}

export function getContractsLinear(): string[][] {
  if (linear.length === 0) {
    return [];
  }
  return linear.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V20,
  ]);
}

export function getContractsDynamic(): string[][] {
  return dynamic.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V20,
  ]);
}

export function getContractsTranched(): string[][] {
  return tranched.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V22,
  ]);
}

export function getContractsMerged(): string[][] {
  return merged.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V23,
  ]);
}

export function getContractRegistry(): string {
  return registry.toLowerCase();
}

export function getChainId(): GraphBigInt {
  return GraphBigInt.fromI32(chainId);
}
