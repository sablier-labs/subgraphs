import { DECIMALS_18 } from "../../common";

export function scale(from: bigint, decimals: bigint): bigint {
  /** The protocol doesn't allow tokens with > 18 decimals, so we can assume a difference >= 0 */
  const difference = DECIMALS_18 - decimals;
  const padding = 10n ** difference;

  return from * padding;
}
