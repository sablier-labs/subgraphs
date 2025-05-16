import type { Sablier } from "@sablier/deployments";

/**
 * Sanitizes the name of a contract to be used in a YAML file.
 * @param name The name of the contract.
 * @param version The version of the contract.
 * @returns The sanitized name of the contract.
 */
export function sanitizeName(contractName: string, version: Sablier.Version): string {
  const sanitizedVersion = version.replace(".", "_");
  return `${contractName}_${sanitizedVersion}`; // e.g. SablierLockup_v2_0
}
