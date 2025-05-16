import * as path from "node:path";
import { logAndThrow } from "@src/winston";
import type { ProtocolArg } from "./types";

export function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}

export function validateProtocolArg(protocolArg: string | undefined): ProtocolArg {
  if (!protocolArg) {
    return "all";
  }

  if (!["airdrops", "flow", "lockup", "all"].includes(protocolArg)) {
    logAndThrow("Protocol argument must be either 'airdrops', 'flow', 'lockup', or 'all'");
  }

  return protocolArg as ProtocolArg;
}
