export { Cache } from "./cache";
export { framework } from "./framework";
import { hexToString, trim } from "viem";

export function fromHex(value: unknown | string) {
  const prepared = (value?.toString() || "") as `0x${string}`;

  const trimmed = trim(prepared, { dir: "right" });
  const converted = hexToString(trimmed);

  return converted;
}
