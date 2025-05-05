import { log } from "@graphprotocol/graph-ts";

/**
 * Log a critical message and exit the program. Without this function, the compiler is not able to detect
 * that the program terminates when `log.critical` is called.
 * @see https://github.com/graphprotocol/graph-tooling/discussions/2014
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/graph-ts/api/#logging-api
 */
export function logAndExit(message: string, dependencies: string[] = []): never {
  log.critical(`[SABLIER] ${message}`, dependencies);
  throw new Error(message);
}
