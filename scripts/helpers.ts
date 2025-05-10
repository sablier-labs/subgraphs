import * as path from "node:path";

export function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}

export function validateProtocolArg(protocolArg: string | undefined): "flow" | "lockup" | "all" {
  if (!protocolArg) {
    throw new Error("Protocol argument is required. Use 'flow', 'lockup', or 'all'");
  }

  if (!["flow", "lockup", "all"].includes(protocolArg)) {
    throw new Error("Protocol argument must be either 'flow', 'lockup', or 'all'");
  }

  return protocolArg as "flow" | "lockup" | "all";
}
