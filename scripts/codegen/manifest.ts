import * as path from "node:path";
import type { Sablier } from "@sablier/deployments";
import supportedChains from "@src/chains";
import { getSources, topConfigs } from "@src/manifest";
import { GRAPH_DIR } from "@src/paths";
import type { Manifest } from "@src/types";
import logger from "@src/winston";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";
import type { ProtocolArg } from "../types";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating subgraph manifests
 *
 * @example Generate for Flow:
 * bun run scripts/codegen/manifest.ts flow
 *
 * @example Generate for Flow on a specific chain:
 * bun run scripts/codegen/manifest.ts flow polygon
 *
 * @example Generate for all protocols:
 * bun run scripts/codegen/manifest.ts all
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} [chainName] - Optional: Chain name to generate manifest for, e.g. 'polygon'
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  const protocolArg = validateProtocolArg(args[0]);
  const chainNameArg = args[1];

  function handleAllProtocols() {
    const protocols: ProtocolArg[] = ["airdrops", "flow", "lockup"];
    let totalManifests = 0;

    for (const p of protocols) {
      if (!chainNameArg) {
        const filesGenerated = generateForAllChains(p, true);
        totalManifests += filesGenerated;
        logger.info(`✅ Generated ${filesGenerated} manifest${filesGenerated !== 1 ? "s" : ""} for ${p} protocol`);
      } else {
        generateForSpecificChain(p, chainNameArg);
      }
    }

    if (!chainNameArg) {
      logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info(`🎉 Successfully generated ${totalManifests} total subgraph manifests!`);
    }
  }

  try {
    if (protocolArg === "all") {
      handleAllProtocols();
    } else {
      if (!chainNameArg) {
        generateForAllChains(protocolArg);
      } else {
        generateForSpecificChain(protocolArg, chainNameArg);
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

function createManifestYAML(protocol: ProtocolArg, chainId: number, chainName: string): string {
  const topConfig = topConfigs[protocol as keyof typeof topConfigs];
  if (!topConfig) {
    logger.error(`Top-level config not found for protocol: ${protocol}`);
    process.exit(1);
  }

  const sources = getSources(protocol as Sablier.Protocol, chainId, chainName);

  // Filter sources by type but also strip the type field from each object
  const dataSources = sources.filter((source) => source.type === "data-source").map(({ type, ...rest }) => rest);
  const templates = sources.filter((source) => source.type === "template").map(({ type, ...rest }) => rest);

  const config = {
    ...topConfig,
    dataSources: dataSources.length > 0 ? dataSources : undefined,
    templates: templates.length > 0 ? templates : undefined,
  } as Manifest.TopConfig;

  const yamlContent = yaml.dump(config, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });
  return `${AUTOGEN_COMMENT}${yamlContent}`;
}

function generateForAllChains(protocol: ProtocolArg, suppressFinalLog = false): number {
  const OUTPUT_DIR = path.join(GRAPH_DIR, `${protocol}/manifests`);

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

    logger.debug(`🔍 Result: ${JSON.stringify(result)}`);
    if (result.success) {
      filesGenerated++;
    }
  }

  if (filesGenerated === 0) {
    logger.error(`No manifests were generated for ${protocol} protocol. This might indicate a configuration issue.`);
    process.exit(1);
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

function generateForSpecificChain(protocol: ProtocolArg, chainName: string): void {
  const chain = supportedChains.find((chain) => chain.name.toLowerCase() === chainName.toLowerCase());
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

function writeManifestToFile(
  protocol: ProtocolArg,
  chain: (typeof supportedChains)[number],
): { success: boolean; error?: string; relativeOutputPath?: string } {
  const OUTPUT_DIR = path.join(GRAPH_DIR, `${protocol}/manifests`);

  try {
    fs.ensureDirSync(OUTPUT_DIR);

    const manifest = createManifestYAML(protocol, chain.id, chain.name);
    const outputPath = path.join(OUTPUT_DIR, `${chain.name}.yaml`);
    fs.writeFileSync(outputPath, manifest);

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
