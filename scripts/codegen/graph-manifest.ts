import * as path from "node:path";
import * as fs from "fs-extra";
import { createGraphManifest } from "../../src/codegen/graph-manifest";
import { getGraphChainName, graphChains } from "../../src/exports/chains";
import paths from "../../src/paths";
import type { Types } from "../../src/types";
import logger from "../../src/winston";
import { PROTOCOLS } from "../constants";
import { dumpYAML, getChain, getRelative, validateChainArg, validateProtocolArg } from "../helpers";

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
 * @param {string} [protocol] - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} [chain] - Required: The chain slug to generate manifests for.
 * Use 'all' to generate for all chains.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = validateProtocolArg(args[0]);
  const chainArg = validateChainArg(args[1]);

  if (protocolArg === "all") {
    codegenAllProtocols(chainArg);
  } else {
    if (chainArg === "all") {
      codegenAllChains(protocolArg);
    } else {
      codegenSpecificChain(protocolArg, chainArg);
    }
  }
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function codegenAllChains(protocol: Types.Protocol, suppressFinalLog = false): number {
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

function codegenAllProtocols(chainArg: string) {
  let totalManifests = 0;

  for (const p of PROTOCOLS) {
    if (chainArg === "all") {
      const filesGenerated = codegenAllChains(p, true);
      totalManifests += filesGenerated;
      logger.info(`✅ Generated ${filesGenerated} manifest${filesGenerated !== 1 ? "s" : ""} for ${p} protocol`);
      continue;
    }

    codegenSpecificChain(p, chainArg);
  }

  if (chainArg === "all") {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`🎉 Successfully generated ${totalManifests} manifests in total!\n`);
  }
}

function codegenSpecificChain(protocol: Types.Protocol, chainArg: string): void {
  const chain = getChain(chainArg);
  const graphChainName = getGraphChainName(chain.id);
  const manifestsDir = paths.graph.manifests(protocol);
  fs.ensureDirSync(manifestsDir);

  const manifestPath = writeManifestToFile(protocol, chain.id, graphChainName);
  logger.info(`🎉 Successfully generated subgraph manifest for ${chainArg}`);
  logger.info(`📁 Manifest path: ${manifestPath}`);
}

function writeManifestToFile(protocol: Types.Protocol, chainId: number, chainName: string): string {
  const manifestsDir = paths.graph.manifests(protocol);
  const manifest = createGraphManifest(protocol, chainId);
  const yaml = dumpYAML(manifest);
  const manifestPath = path.join(manifestsDir, `${chainName}.yaml`);
  fs.writeFileSync(manifestPath, yaml);

  logger.verbose(`✅ Generated manifest: ${getRelative(manifestPath)}`);
  return getRelative(manifestPath);
}
