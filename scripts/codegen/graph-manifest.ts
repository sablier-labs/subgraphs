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
/*                                    MAIN                                    */
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
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);
  const chainNameArg = args[1];

  function handleAll() {
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
      logger.info(`🎉 Successfully generated ${totalManifests} manifests in total!\n`);
    }
  }

  if (protocolArg === "all") {
    handleAll();
  } else {
    if (!chainNameArg) {
      generateForAllChains(protocolArg);
    } else {
      generateForSpecificChain(protocolArg, chainNameArg);
    }
  }
}

main().catch((error) => {
  logAndThrow(`❌ Error generating Graph manifest: ${error.message}`);
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function getYAMLContent(protocol: Indexed.Protocol, chainId: number): string {
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
    writeManifestToFile(protocol, chain.id, chain.graph.name);
    filesGenerated++;
  }

  if (filesGenerated === 0) {
    logAndThrow(`No manifests generated for ${protocol} protocol. This might indicate a configuration issue.`);
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
    const message = `❌ Error: Chain "${chainName}" is not supported.\nAvailable chains: ${availableChains}`;
    logAndThrow(message);
  }

  const manifestsDir = paths.graphManifests(protocol);
  fs.ensureDirSync(manifestsDir);

  const manifestPath = writeManifestToFile(protocol, chain.id, chain.graph.name);
  logger.info(`🎉 Successfully generated subgraph manifest for ${chainName}`);
  logger.info(`📁 Manifest path: ${manifestPath}`);
}

/**
 * @returns The relative path to the manifest file.
 */
function writeManifestToFile(protocol: Indexed.Protocol, chainId: number, chainName: string): string {
  const manifestsDir = paths.graphManifests(protocol);
  const content = getYAMLContent(protocol, chainId);
  const manifestPath = path.join(manifestsDir, `${chainName}.yaml`);
  fs.writeFileSync(manifestPath, content);

  logger.verbose(`✅ Generated manifest: ${getRelative(manifestPath)}`);
  return getRelative(manifestPath);
}
