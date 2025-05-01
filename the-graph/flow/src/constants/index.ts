import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  chainId,
  flow,
  initializer_flow as initializer,
} from "../generated/env";

export let zero = BigInt.fromI32(0);
export let one = BigInt.fromI32(1);
export let two = BigInt.fromI32(2);
export let d18 = BigInt.fromI32(18);

export let FLOW_SCALED_DECIMALS = d18;

export let put = 0;
export let call = 1;

export let ADDRESS_ZERO = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000000",
);

export let StreamVersion_V10 = "V10";
export let StreamVersion_V11 = "V11";

export function getContractInitializer(): string {
  return initializer.toLowerCase();
}

export function getContractsFlow(): string[][] {
  if (flow.length === 0) {
    return [];
  }
  return flow.map<string[]>((item) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V10,
  ]);
}

export function getChainId(): BigInt {
  return BigInt.fromI32(chainId);
}

export function log_exit(message: string, dependencies: string[] = []): void {
  log.debug(`[SABLIER] ${message}`, dependencies);
  log.error(`[SABLIER] ${message}`, dependencies);
  // log.critical("[SABLIER] Critical exit.", []);
}

export function log_debug(message: string, dependencies: string[] = []): void {
  log.debug(`[SABLIER] ${message}`, dependencies);
}
