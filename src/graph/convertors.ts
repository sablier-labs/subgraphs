import { Address, BigInt as BInt, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "./constants";

export function convertExponentToBigInt(decimals: BInt): BInt {
  let base = BInt.fromI32(1);
  for (let i = ZERO; i.lt(decimals); i = i.plus(ONE)) {
    base = base.times(BInt.fromI32(10));
  }
  return base;
}

export function convertStringToPaddedZero(source: string): string {
  let result = source;
  while (result.length !== 66) {
    result = result.concat("0");
  }

  return result;
}

export function toValue(source: BInt): ethereum.Value {
  return ethereum.Value.fromUnsignedBigInt(source);
}

export function toEventAddress(key: string, value: Address): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromAddress(value));
}

export function toEventBoolean(key: string, value: boolean): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromBoolean(value));
}

export function toEventTuple(key: string, value: ethereum.Tuple): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromTuple(value));
}
