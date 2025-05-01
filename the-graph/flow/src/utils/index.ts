import { Address, BigInt } from "@graphprotocol/graph-ts";
import { FLOW_SCALED_DECIMALS, one, zero } from "../constants";
import { getOrCreateAsset } from "../helpers/asset";

export function toScaled(from: BigInt, assetAddress: string): BigInt {
  /** The protocol doesn't allow tokens with > 18 decimals, so we can assume a difference >= 0 */

  const asset = getOrCreateAsset(Address.fromString(assetAddress));
  const difference = FLOW_SCALED_DECIMALS.minus(asset.decimals);

  let padding = BigInt.fromI32(1);
  for (let i = zero; i.lt(difference); i = i.plus(one)) {
    padding = padding.times(BigInt.fromI32(10));
  }

  return from.times(padding);
}
