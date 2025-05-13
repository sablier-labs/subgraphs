import * as path from "node:path";
import logger from "@src/winston";
import type { ProtocolArg } from "./types";

export function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}

export function validateProtocolArg(protocolArg: string | undefined): ProtocolArg {
  if (!protocolArg) {
    logger.error("Protocol argument is required. Use 'airdrops', 'flow', 'lockup', or 'all'");
    process.exit(1);
  }

  if (!["airdrops", "flow", "lockup", "all"].includes(protocolArg)) {
    logger.error("Protocol argument must be either 'airdrops', 'flow', 'lockup', or 'all'");
    process.exit(1);
  }

  return protocolArg as ProtocolArg;
}
