import * as path from "node:path";
import { Command } from "commander";
import * as yaml from "js-yaml";
import { type Sablier, sablier } from "sablier";
import type { EnvioConfig } from "../src/codegen/envio-config/config-types";
import type { GraphManifest } from "../src/codegen/graph-manifest/manifest-types";
import { AUTOGEN_COMMENT, PROTOCOLS, VENDORS } from "./constants";
import type { ProtocolArg, VendorArg } from "./types";

export function addChainOption(command: Command): Command {
  return command.option("-c, --chain <chain>", 'chain slug (use "all" for all chains)');
}

export function addProtocolOption(command: Command): Command {
  return command.option("-p, --protocol <protocol>", 'protocol: airdrops, flow, lockup, or "all"');
}

export function addVendorOption(command: Command): Command {
  return command.option("-v, --vendor <vendor>", 'vendor: graph, envio, or "all"');
}

export function createBaseCommand(description: string): Command {
  return new Command()
    .description(description)
    .helpOption("-h, --help", "display help for command")
    .option("--verbose", "enable verbose logging");
}

export function parseChainOption(chainValue: string | undefined): string {
  if (!chainValue) {
    throw new Error("--chain is required. Use 'all' to target all chains.");
  }

  if (chainValue === "all") {
    return "all";
  }

  getChain(chainValue);
  return chainValue;
}

export function parseProtocolOption(protocolValue: string | undefined): ProtocolArg {
  if (!protocolValue) {
    throw new Error("--protocol is required. Use 'all' to target all protocols.");
  }

  if (![...PROTOCOLS, "all"].includes(protocolValue)) {
    throw new Error("--protocol must be either 'airdrops', 'flow', 'lockup', or 'all'");
  }

  return protocolValue as ProtocolArg;
}

export function parseVendorOption(vendorValue: string | undefined): VendorArg {
  if (!vendorValue) {
    throw new Error("--vendor is required. Use 'all' to target all vendors.");
  }

  if (![...VENDORS, "all"].includes(vendorValue)) {
    throw new Error("--vendor must be either 'graph', 'envio', or 'all'");
  }

  return vendorValue as VendorArg;
}

export function dumpYAML(input: GraphManifest.TopSection | EnvioConfig.TopSection): string {
  const yamlContent = yaml.dump(input, {
    forceQuotes: true, // Force quotes for all strings
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });

  return `${AUTOGEN_COMMENT}${yamlContent}`;
}

export function getChain(chainArg: string): Sablier.Chain {
  const chain = sablier.chains.getBySlug(chainArg);
  if (!chain) {
    const availableChains = sablier.chains
      .getAll()
      .map((c) => c.slug)
      .join(", ");
    throw new Error(`Chain "${chainArg}" is not supported.\nAvailable chains: ${availableChains}`);
  }
  return chain;
}

export function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}
