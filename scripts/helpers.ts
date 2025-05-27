import * as path from "node:path";
import type { EnvioConfig } from "@src/envio-config/types";
import type { GraphManifest } from "@src/graph-manifest/types";
import * as yaml from "js-yaml";
import { AUTOGEN_COMMENT } from "./constants";
import type { ProtocolArg, VendorArg } from "./types";

export function dumpYAML(input: GraphManifest.TopSection | EnvioConfig.TopSection): string {
  const yamlContent = yaml.dump(input, {
    forceQuotes: true, // Force quotes for all strings
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });

  return `${AUTOGEN_COMMENT}${yamlContent}`;
}

export function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}

export function validateProtocolArg(protocolArg: string | undefined): ProtocolArg {
  if (!protocolArg) {
    return "all";
  }

  if (!["airdrops", "flow", "lockup", "all"].includes(protocolArg)) {
    throw new Error("Protocol argument must be either 'airdrops', 'flow', 'lockup', or 'all'");
  }

  return protocolArg as ProtocolArg;
}

export function validateVendorArg(vendorArg: string | undefined): VendorArg {
  if (!vendorArg) {
    return "all";
  }

  if (!["graph", "envio", "all"].includes(vendorArg)) {
    throw new Error("Vendor argument must be either 'graph', 'envio', or 'all'");
  }

  return vendorArg as VendorArg;
}
