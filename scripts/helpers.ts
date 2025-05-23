import * as path from "node:path";
import { logAndThrow } from "@src/winston";
import type { ProtocolArg, VendorArg } from "./types";

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

export function validateVendorArg(vendorArg: string | undefined): VendorArg {
  if (!vendorArg) {
    return "all";
  }

  if (!["graph", "envio", "all"].includes(vendorArg)) {
    logAndThrow("Vendor argument must be either 'graph', 'envio', or 'all'");
  }

  return vendorArg as VendorArg;
}
