import * as path from "node:path";
import { graphChains } from "@src/chains";
import { createGraphManifest } from "@src/graph-manifest";
import { paths } from "@src/paths";
import type { Indexed } from "@src/types";
import logger, { logAndThrow } from "@src/winston";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import { AUTOGEN_COMMENT } from "../constants";
import { getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating subgraph manifests
 *
 * @example Generate for Flow:
 * just codegen-manifest flow
 *
 * @example Generate for Flow on a specific chain:
 * just codegen-manifest flow polygon
 *
 * @example Generate for all protocols:
 * just codegen-manifest all
 *
 * @param {string} [protocol='all'] - 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} [chainName] - If not provided, the manifest will be generated for all chains.
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  const protocolArg = validateProtocolArg(args[0]);
  const chainNameArg = args[1];

  function handleAllProtocols() {
    const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];
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
    logAndThrow(`❌ Unhandled error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function dumpYAML(protocol: Indexed.Protocol, chainId: number): string {
  const manifest = createGraphManifest(protocol, chainId);
  const yamlContent = yaml.dump(manifest, {
    lineWidth: -1, // Prevent line wrapping
    quotingType: '"', // Use double quotes for strings
  });
  return `${AUTOGEN_COMMENT}${yamlContent}`;
}

function generateForAllChains(protocol: Indexed.Protocol, suppressFinalLog = false): number {
  const manifestsDir = paths.graphManifests(protocol);

  if (fs.pathExistsSync(manifestsDir)) {
    fs.emptyDirSync(manifestsDir);
    logger.verbose("🗑️ Cleared existing manifests directory");
  } else {
    fs.ensureDirSync(manifestsDir);
    logger.verbose(`📁 Created directory:      ${getRelative(manifestsDir)}`);
  }

  let filesGenerated = 0;

  for (const chain of graphChains) {
    const result = writeManifestToFile(protocol, chain.id, chain.graph.name);

    logger.debug(`🔍 Result: ${JSON.stringify(result)}`);
    if (result.success) {
      filesGenerated++;
    }
  }

  if (filesGenerated === 0) {
    logAndThrow(`No manifests were generated for ${protocol} protocol. This might indicate a configuration issue.`);
  }

  if (!suppressFinalLog) {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(
      `🎉 Successfully generated ${filesGenerated} subgraph manifest${filesGenerated !== 1 ? "s" : ""} for ${protocol} protocol!`,
    );
    logger.info(`📁 Output directory: ${getRelative(manifestsDir)}`);
  }

  return filesGenerated;
}

function generateForSpecificChain(protocol: Indexed.Protocol, chainName: string): void {
  const chain = graphChains.find((chain) => chain.graph.name.toLowerCase() === chainName.toLowerCase());
  if (!chain) {
    const availableChains = graphChains.map((c) => c.graph.name).join(", ");
    const message = `❌ Error: Chain "${chainName}" not found in supported chains.\nAvailable chains: ${availableChains}`;
    logAndThrow(message);
  }

  const manifestsDir = paths.graphManifests(protocol);
  fs.ensureDirSync(manifestsDir);

  const result = writeManifestToFile(protocol, chain.id, chain.graph.name);
  if (!result.success) {
    logAndThrow(`❌ Error: ${result.error}`);
  }

  logger.info(`🎉 Successfully generated subgraph manifest for ${chainName}`);
  logger.info(`📁 Manifest path: ${result.relativeOutputPath}`);
}

function writeManifestToFile(
  protocol: Indexed.Protocol,
  chainId: number,
  chainName: string,
): { success: boolean; error?: string; relativeOutputPath?: string } {
  const manifestsDir = paths.graphManifests(protocol);

  try {
    const manifest = dumpYAML(protocol, chainId);
    const manifestPath = path.join(manifestsDir, `${chainName}.yaml`);
    fs.writeFileSync(manifestPath, manifest);

    logger.verbose(`✅ Generated manifest: ${getRelative(manifestPath)}`);

    return {
      success: true,
      relativeOutputPath: getRelative(manifestPath),
    };
  } catch (error) {
    return {
      success: false,
      error: `Error generating manifest for chain ${chainName}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
