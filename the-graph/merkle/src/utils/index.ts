import { BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import { one, zero } from "../constants";

export function convertExponentToBigInt(decimals: GraphBigInt): GraphBigInt {
  let base = GraphBigInt.fromI32(1);
  for (let i = zero; i.lt(decimals); i = i.plus(one)) {
    base = base.times(GraphBigInt.fromI32(10));
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
