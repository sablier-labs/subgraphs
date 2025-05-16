import { hexToString, trim } from "viem";
import { DECIMALS_18 } from "./constants";

export function fromHex(value: unknown | string) {
  const prepared = (value?.toString() || "") as `0x${string}`;

  const trimmed = trim(prepared, { dir: "right" });
  const converted = hexToString(trimmed);

  return converted;
}

export function toScaled(from: bigint, decimals: bigint): bigint {
  /** The protocol doesn't allow tokens with > 18 decimals, so we can assume a difference >= 0 */
  const difference = DECIMALS_18 - decimals;
  const padding = 10n ** difference;

  return from * padding;
}
