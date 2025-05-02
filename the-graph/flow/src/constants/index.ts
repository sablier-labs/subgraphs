import { Bytes, BigInt as GraphBigInt, log } from "@graphprotocol/graph-ts";
import { chainId, flow, initializer_flow as initializer } from "../generated/env";

export const zero = GraphBigInt.fromI32(0);
export const one = GraphBigInt.fromI32(1);
export const two = GraphBigInt.fromI32(2);
export const d18 = GraphBigInt.fromI32(18);

export const FLOW_SCALED_DECIMALS = d18;

export const put = 0;
export const call = 1;

export const ADDRESS_ZERO = Bytes.fromHexString("0x0000000000000000000000000000000000000000");

export const StreamVersion_V10 = "V10";
export const StreamVersion_V11 = "V11";

export function getContractInitializer(): string {
  return initializer.toLowerCase();
}

export function getContractsFlow(): string[][] {
  if (flow.length === 0) {
    return [];
  }
  return flow.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V10,
  ]);
}

export function getChainId(): GraphBigInt {
  return GraphBigInt.fromI32(chainId);
}

export function log_exit(message: string, dependencies: string[] = []): void {
  log.debug(`[SABLIER] ${message}`, dependencies);
  log.error(`[SABLIER] ${message}`, dependencies);
  // log.critical("[SABLIER] Critical exit.", []);
}

export function log_debug(message: string, dependencies: string[] = []): void {
  log.debug(`[SABLIER] ${message}`, dependencies);
}
