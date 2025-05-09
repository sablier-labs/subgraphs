import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";

import { supportedChains } from "../src/chains";
import { getDataSources, topConfigs } from "../src/manifest";
import type { Manifest } from "../src/types";
import logger from "../src/winston";

/*//////////////////////////////////////////////////////////////////////////
                                CONSTANTS
//////////////////////////////////////////////////////////////////////////*/

const TEMPLATE_DIR = path.join(__dirname, "../src/graph");

/*//////////////////////////////////////////////////////////////////////////
                                    CLI
//////////////////////////////////////////////////////////////////////////*/

/**
 * CLI for generating subgraph manifests
 *
 * @example Generate manifest for flow protocol on all chains:
 * bun run scripts/generate-manifests.ts flow
 *
 * @example Generate manifest for a specific protocol and chain:
 * bun run scripts/generate-manifests.ts flow mainnet
 *
 * @example Generate manifest with verbose logging:
 * bun run scripts/generate-manifests.ts flow --verbose
 *
 * @param {string} protocol - Required. Either 'flow' or 'lockup'
 * @param {string} [chainName] - Optional. Chain name to generate manifest for (e.g., 'polygon')
 * @param {boolean} [--verbose] - Optional flag. Display detailed logs during execution
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const verboseIndex = args.indexOf("--verbose");

  // Remove verbose flag from args if present
  if (verboseIndex !== -1) {
    args.splice(verboseIndex, 1);
  }

  const protocolArg = args[0];
  const chainNameArg = args[1];

  if (!protocolArg) {
    logger.error("❌ Error: Protocol argument is required. Use 'flow' or 'lockup'");
    process.exit(1);
  }

  if (!["flow", "lockup"].includes(protocolArg)) {
    logger.error("❌ Error: Protocol argument must be either 'flow' or 'lockup'");
    process.exit(1);
  }

  const protocol = protocolArg as "flow" | "lockup";

  try {
    if (chainNameArg) {
      // Generate manifest for specific chain
      const chain = findChainByName(chainNameArg);
      if (!chain) {
        const availableChains = supportedChains.map((chain) => chain.name).join(", ");
        logger.error(`❌ Error: Chain "${chainNameArg}" not found in supported chains.`);
        logger.error(`Available chains: ${availableChains}`);
        process.exit(1);
      }

      const result = generateManifestFile(protocol, chain);
      if (!result.success) {
        logger.error(`❌ Error: ${result.error}`);
        process.exit(1);
      }

      logger.info(`🎉 Successfully generated the subgraph manifest for ${chain.name} (ID: ${chain.id})`);
      logger.info(`📁 Manifest path: ${result.relativeOutputPath}`);
    } else {
      generateAllManifests(protocol);
    }
  } catch (error) {
    logger.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/*//////////////////////////////////////////////////////////////////////////
                                FUNCTIONS
//////////////////////////////////////////////////////////////////////////*/

/**
 * Generates and writes a manifest file for a specific chain
 * @param protocol The protocol to generate a manifest for ('flow' or 'lockup')
 * @param chain The chain configuration
 * @returns Result of the manifest generation
 */
function generateManifestFile(
  protocol: "flow" | "lockup",
  chain: (typeof supportedChains)[number],
): { success: boolean; error?: string; relativeOutputPath?: string } {
  const OUTPUT_DIR = path.join(TEMPLATE_DIR, `${protocol}/manifests`);

  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      logger.verbose(`📁 Created directory: ${getRelative(OUTPUT_DIR)}`);
    }

    const yamlString = generateManifest(protocol, chain.id, chain.name);
    const outputPath = path.join(OUTPUT_DIR, `${chain.name}.yaml`);

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

/**
 * Generates and writes manifests for all supported chains
 * @param protocol The Sablier protocol to use ("flow" or "lockup")
 * @returns Number of successfully generated manifests
 */
function generateAllManifests(protocol: "flow" | "lockup"): number {
  const OUTPUT_DIR = path.join(TEMPLATE_DIR, `${protocol}/manifests`);

  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    let deletedCount = 0;

    for (const file of files) {
      if (file.endsWith(".yaml")) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      logger.verbose(`🗑️  Deleted ${deletedCount} existing manifest${deletedCount !== 1 ? "s" : ""}`);
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    logger.verbose(`📁 Created directory:      ${getRelative(OUTPUT_DIR)}`);
  }

  let filesGenerated = 0;

  for (const chain of supportedChains) {
    const result = generateManifestFile(protocol, chain);

    if (result.success) {
      filesGenerated++;
    }
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info(`🎉 Successfully generated ${filesGenerated} subgraph manifest${filesGenerated !== 1 ? "s" : ""}!`);
  logger.info(`📁 Output directory: ${getRelative(OUTPUT_DIR)}`);

  return filesGenerated;
}

/**
 * Generates a YAML manifest for the specified protocol
 * @param protocol The protocol to generate a manifest for ('flow' or 'lockup')
 * @param chainId The chain ID
 * @param chainName The chain name
 * @returns YAML string representation of the manifest
 */
function generateManifest(protocol: "flow" | "lockup", chainId: number, chainName: string): string {
  const topConfig = topConfigs[protocol as keyof typeof topConfigs];
  if (!topConfig) {
    throw new Error(`Top-level config not found for protocol: ${protocol}`);
  }

  const dataSources = getDataSources(protocol, chainId, chainName);

  const config = {
    ...topConfig,
    dataSources,
  } as Manifest.TopConfig;

  const comment = "# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n";
  const yamlContent = yaml.dump(config, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });
  return `${comment}${yamlContent}`;
}

/*//////////////////////////////////////////////////////////////////////////
                                  HELPERS
//////////////////////////////////////////////////////////////////////////*/

/** @internal */
function findChainByName(chainName: string) {
  return supportedChains.find((chain) => chain.name.toLowerCase() === chainName.toLowerCase());
}

/** @internal */
function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}
