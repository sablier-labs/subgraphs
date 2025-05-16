import type { Sablier } from "@sablier/deployments";
import logger from "./logger";

/**
 * Logs an error message and exits the process by throwing an error.
 *
 * @param message The error message to log
 * @example
 * if (!contract) {
 *   logAndThrow(`Contract not found: ${contract}`);
 * }
 */
export function logAndThrow(message: string): never {
  logger.error(message);
  throw new Error(message);
}

export function formatRelease(release: Sablier.Release) {
  return `${release.protocol} ${release.version}`;
}
