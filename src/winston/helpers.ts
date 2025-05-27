import type { Sablier } from "@sablier/deployments";

/**
 * Logs an error message with stack trace and exits the process by throwing an error.
 *
 * @param error The error object or message to log
 * @param customMessage Optional custom message to override the error message
 * @example
 * if (!contract) {
 *   logAndThrow(new Error(`Contract not found: ${contract}`));
 * }
 *
 * // Or with custom message
 * try {
 *   // some operation
 * } catch (err) {
 *   logAndThrow(err, "Failed to process contract");
 * }
 */
// export function logAndThrow(error: Error | string, customMessage?: string): never {
//   const errorObj = typeof error === "string" ? new Error(error) : error;
//   const message = customMessage || errorObj.message;

//   logger.error(message);
//   if (errorObj.stack) {
//     logger.error(errorObj.stack);
//   }

//   throw errorObj;
// }

export function formatRelease(release: Sablier.Release) {
  return `${release.protocol} ${release.version}`;
}
