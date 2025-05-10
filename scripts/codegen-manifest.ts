import * as path from "node:path";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";

import { supportedChains } from "@src/chains";
import { getDataSources, topConfigs } from "@src/manifest";
import type { Manifest } from "@src/types";
import logger from "@src/winston";
import { AUTOGEN_COMMENT, GRAPH_DIR } from "./constants";
import { getRelative, validateProtocolArg } from "./helpers";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating subgraph manifests
 *
 * @example Generate manifest for Flow:
 * bun run scripts/codegen-manifest.ts flow
 *
 * @example Generate manifest for Flow on a specific chain:
 * bun run scripts/codegen-manifest.ts flow polygon
 *
 * @example Generate manifests for all protocols:
 * bun run scripts/codegen-manifest.ts all
 *
 * @param {string} protocol - Required. Either 'flow', 'lockup', or 'all'
 * @param {string} [chainName] - Optional. Chain name to generate manifest for, e.g. 'polygon'
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  const protocolArg = validateProtocolArg(args[0]);
  const chainNameArg = args[1];

  function handleAllProtocols() {
    const protocols: Array<"flow" | "lockup"> = ["flow", "lockup"];
    let totalManifests = 0;

    for (const protocol of protocols) {
      if (!chainNameArg) {
        const filesGenerated = generateForAllChains(protocol, true);
        totalManifests += filesGenerated;
        logger.info(
          `✅ Generated ${filesGenerated} manifest${filesGenerated !== 1 ? "s" : ""} for ${protocol} protocol`,
        );
      } else {
        generateForSpecificChain(protocol, chainNameArg);
      }
    }

    if (!chainNameArg) {
      logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info(`🎉 Successfully generated ${totalManifests} total subgraph manifests across all protocols!`);
    }
  }

  try {
    if (protocolArg === "all") {
      handleAllProtocols();
    } else {
      const protocol = protocolArg as "flow" | "lockup";
      if (!chainNameArg) {
        generateForAllChains(protocol);
      } else {
        generateForSpecificChain(protocol, chainNameArg);
      }
    }
  } catch (error) {
    logger.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Generates a YAML manifest for the specified protocol
 * @param protocol The protocol to generate a manifest for
 * @param chainId The chain ID
 * @param chainName The chain name
 * @returns YAML string representation of the manifest
 */
function createManifestContent(protocol: "flow" | "lockup", chainId: number, chainName: string): string {
  const topConfig = topConfigs[protocol as keyof typeof topConfigs];
  if (!topConfig) {
    throw new Error(`Top-level config not found for protocol: ${protocol}`);
  }

  const dataSources = getDataSources(protocol, chainId, chainName);

  const config = {
    ...topConfig,
    dataSources,
  } as Manifest.TopConfig;

  const yamlContent = yaml.dump(config, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });
  return `${AUTOGEN_COMMENT}${yamlContent}`;
}

/**
 * Generates and writes manifests for all supported chains
 * @param protocol The Sablier protocol to use ("flow" or "lockup")
 * @param suppressFinalLog Whether to suppress the final success log message
 * @returns Number of successfully generated manifests
 */
function generateForAllChains(protocol: "flow" | "lockup", suppressFinalLog = false): number {
  const OUTPUT_DIR = path.join(GRAPH_DIR, `${protocol}/manifests`);

  // Clear and ensure the output directory exists
  if (fs.pathExistsSync(OUTPUT_DIR)) {
    fs.emptyDirSync(OUTPUT_DIR);
    logger.verbose("🗑️  Cleared existing manifests directory");
  } else {
    fs.ensureDirSync(OUTPUT_DIR);
    logger.verbose(`📁 Created directory:      ${getRelative(OUTPUT_DIR)}`);
  }

  let filesGenerated = 0;

  for (const chain of supportedChains) {
    const result = writeManifestToFile(protocol, chain);

    if (result.success) {
      filesGenerated++;
    }
  }

  if (!suppressFinalLog) {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(
      `🎉 Successfully generated ${filesGenerated} subgraph manifest${filesGenerated !== 1 ? "s" : ""} for ${protocol} protocol!`,
    );
    logger.info(`📁 Output directory: ${getRelative(OUTPUT_DIR)}`);
  }

  return filesGenerated;
}

/**
 * Handles manifest generation for a specific chain
 * @param protocol The protocol to generate for
 * @param chainName The chain name to generate for
 */
function generateForSpecificChain(protocol: "flow" | "lockup", chainName: string): void {
  const chain = findChainByName(chainName);
  if (!chain) {
    const availableChains = supportedChains.map((chain) => chain.name).join(", ");
    logger.error(`❌ Error: Chain "${chainName}" not found in supported chains.`);
    logger.error(`Available chains: ${availableChains}`);
    process.exit(1);
  }

  // Ensure the output directory exists
  const OUTPUT_DIR = path.join(GRAPH_DIR, `${protocol}/manifests`);
  fs.ensureDirSync(OUTPUT_DIR);

  const result = writeManifestToFile(protocol, chain);
  if (!result.success) {
    logger.error(`❌ Error: ${result.error}`);
    process.exit(1);
  }

  logger.info(`🎉 Successfully generated the subgraph manifest for ${chain.name}`);
  logger.info(`📁 Manifest path: ${result.relativeOutputPath}`);
}

/**
 * Generates and writes a manifest file for a specific chain
 * @param protocol The protocol to generate a manifest for ('flow' or 'lockup')
 * @param chain The chain configuration
 * @returns Result of the manifest generation
 */
function writeManifestToFile(
  protocol: "flow" | "lockup",
  chain: (typeof supportedChains)[number],
): { success: boolean; error?: string; relativeOutputPath?: string } {
  const OUTPUT_DIR = path.join(GRAPH_DIR, `${protocol}/manifests`);

  try {
    // Ensure output directory exists
    fs.ensureDirSync(OUTPUT_DIR);

    const yamlString = createManifestContent(protocol, chain.id, chain.name);
    const outputPath = path.join(OUTPUT_DIR, `${chain.name}.yaml`);

    // Write file in a single operation
    fs.writeFileSync(outputPath, yamlString);

    logger.verbose(`✅ Generated manifest: ${getRelative(outputPath)}`);

    return {
      success: true,
      relativeOutputPath: getRelative(outputPath),
    };
  } catch (error) {
    return {
      success: false,
      error: `Error generating manifest for chain ${chain.name}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

/** @internal */
function findChainByName(chainName: string) {
  return supportedChains.find((chain) => chain.name.toLowerCase() === chainName.toLowerCase());
}
