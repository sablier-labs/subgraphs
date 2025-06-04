import * as path from "node:path";
import * as fs from "fs-extra";
import { graphChains } from "../../src/chains";
import { createGraphManifest } from "../../src/graph-manifest";
import paths from "../../src/paths";
import type { Indexed } from "../../src/types";
import logger from "../../src/winston";
import { dumpYAML, getRelative, validateProtocolArg } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

/**
 * CLI for generating subgraph manifests
 *
 * @example Generate for all protocols on all chains:
 * just codegen-manifest all all
 *
 * @example Generate for all protocols on a specific chain:
 * just codegen-manifest all polygon
 *
 * @param {string} [protocol] - 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} [chainName] - The chain name to generate manifests for. Use 'all' to generate for all chains.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);
  let chainArg = args[1];

  if (!chainArg) {
    throw new Error("❌ Error: Chain name argument is required. Use 'all' to generate for all chains.");
  }
  chainArg = chainArg.toLowerCase();

  function handleAllProtocols() {
    const protocols: Indexed.Protocol[] = ["airdrops", "flow", "lockup"];
    let totalManifests = 0;

    for (const p of protocols) {
      if (chainArg === "all") {
        const filesGenerated = generateForAllChains(p, true);
        totalManifests += filesGenerated;
        logger.info(`✅ Generated ${filesGenerated} manifest${filesGenerated !== 1 ? "s" : ""} for ${p} protocol`);
      } else {
        generateForSpecificChain(p, chainArg);
      }
    }

    if (chainArg === "all") {
      logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      logger.info(`🎉 Successfully generated ${totalManifests} manifests in total!\n`);
    }
  }

  if (protocolArg === "all") {
    handleAllProtocols();
  } else {
    if (chainArg.toLowerCase() === "all") {
      generateForAllChains(protocolArg);
    } else {
      generateForSpecificChain(protocolArg, chainArg);
    }
  }
}

main();

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function generateForAllChains(protocol: Indexed.Protocol, suppressFinalLog = false): number {
  const manifestsDir = paths.graph.manifests(protocol);

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
    throw new Error(`No manifests generated for ${protocol} protocol. This might indicate a configuration issue.`);
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
    throw new Error(message);
  }

  const manifestsDir = paths.graph.manifests(protocol);
  fs.ensureDirSync(manifestsDir);

  const manifestPath = writeManifestToFile(protocol, chain.id, chain.graph.name);
  logger.info(`🎉 Successfully generated subgraph manifest for ${chainName}`);
  logger.info(`📁 Manifest path: ${manifestPath}`);
}

function writeManifestToFile(protocol: Indexed.Protocol, chainId: number, chainName: string): string {
  const manifestsDir = paths.graph.manifests(protocol);
  const manifest = createGraphManifest(protocol, chainId);
  const yaml = dumpYAML(manifest);
  const manifestPath = path.join(manifestsDir, `${chainName}.yaml`);
  fs.writeFileSync(manifestPath, yaml);

  logger.verbose(`✅ Generated manifest: ${getRelative(manifestPath)}`);
  return getRelative(manifestPath);
}
