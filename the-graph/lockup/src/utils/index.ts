import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { one, zero } from "../constants";

export function convertExponentToBigInt(decimals: BigInt): BigInt {
  let base = BigInt.fromI32(1);
  for (let i = zero; i.lt(decimals); i = i.plus(one)) {
    base = base.times(BigInt.fromI32(10));
  }
  return base;
}

export function convertStringToPaddedZero(source: String): String {
  let result = source;
  while (result.length !== 66) {
    result = result.concat("0");
  }

  return result;
}

export function toValue(source: BigInt): ethereum.Value {
  return ethereum.Value.fromUnsignedBigInt(source);
}

export function toEventAddress(
  key: string,
  value: Address,
): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromAddress(value));
}

export function toEventBoolean(
  key: string,
  value: boolean,
): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromBoolean(value));
}
export function toEventTuple(
  key: string,
  value: ethereum.Tuple,
): ethereum.EventParam {
  return new ethereum.EventParam(key, ethereum.Value.fromTuple(value));
}
