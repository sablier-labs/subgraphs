import { AIRDROPS_V1_1, AIRDROPS_V1_2 } from "../../common/constants";
import { readContractVersion } from "../../common/context";

/**
 * Only Airdrops v1.3 and above support fees.
 */
export function isVersionWithFees(): boolean {
  const version = readContractVersion();
  return version !== AIRDROPS_V1_1 && version !== AIRDROPS_V1_2;
}
