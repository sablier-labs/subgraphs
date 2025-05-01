import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  chainId,
  dynamic,
  initializer_lockup as initializer,
  linear,
  merged,
  registry,
  tranched,
} from "../generated/env";

export let zero = BigInt.fromI32(0);
export let one = BigInt.fromI32(1);
export let two = BigInt.fromI32(2);
export let d18 = BigInt.fromI32(18);

export let ADDRESS_ZERO = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000000",
);

export let StreamVersion_V20 = "V20";
export let StreamVersion_V21 = "V21";
export let StreamVersion_V22 = "V22";
export let StreamVersion_V23 = "V23";

export function getContractInitializer(): string {
  return initializer.toLowerCase();
}

export function getContractsLinear(): string[][] {
  if (linear.length === 0) {
    return [];
  }
  return linear.map<string[]>((item) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V20,
  ]);
}

export function getContractsDynamic(): string[][] {
  return dynamic.map<string[]>((item) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V20,
  ]);
}

export function getContractsTranched(): string[][] {
  return tranched.map<string[]>((item) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V22,
  ]);
}

export function getContractsMerged(): string[][] {
  return merged.map<string[]>((item) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V23,
  ]);
}

export function getContractRegistry(): string {
  return registry.toLowerCase();
}

export function getChainId(): BigInt {
  return BigInt.fromI32(chainId);
}
