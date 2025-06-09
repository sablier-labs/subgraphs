/**
 * @file CLI for generating subgraph manifests
 *
 * @example
 * just codegen-manifest all all
 * just codegen-manifest all polygon
 * just codegen-manifest flow polygon
 *
 * @param {string} protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} chain - Required: The chain slug to generate manifests for.
 * Use 'all' to generate for all chains.
 */
import * as path from "node:path";
import * as fs from "fs-extra";
import { createGraphManifest } from "../../src/codegen/graph-manifest";
import { GRAPH_CHAINS, getGraphChainName } from "../../src/exports/chains";
import paths from "../../src/paths";
import type { Types } from "../../src/types";
import logger from "../../src/winston";
import { PROTOCOLS } from "../constants";
import * as helpers from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const protocolArg = helpers.validateProtocolArg(args[0]);
  const chainArg = helpers.validateChainArg(args[1]);

  if (protocolArg === "all") {
    codegenAllProtocols(chainArg);
    return;
  }

  if (chainArg === "all") {
    codegenAllChains(protocolArg);
    return;
  }

  codegen(protocolArg, chainArg);
}

if (require.main === module) {
  main();
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function codegenAllProtocols(chainArg: string) {
  let totalManifests = 0;

  for (const p of PROTOCOLS) {
    if (chainArg === "all") {
      const filesGenerated = codegenAllChains(p, true);
      totalManifests += filesGenerated;
      logger.info(`✅ Generated ${filesGenerated} manifests for ${p} protocol`);
      continue;
    }

    codegen(p, chainArg);
  }

  if (chainArg === "all") {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`🎉 Successfully generated ${totalManifests} manifests in total!\n`);
  }
}

function codegenAllChains(protocol: Types.Protocol, suppressFinalLog = false): number {
  const manifestsDir = paths.graph.manifests(protocol);

  if (fs.pathExistsSync(manifestsDir)) {
    fs.emptyDirSync(manifestsDir);
    logger.verbose("🗑️ Cleared existing manifests directory");
  }

  let filesGenerated = 0;
  for (const c of GRAPH_CHAINS) {
    writeManifestToFile(protocol, c.id, c.name);
    filesGenerated++;
  }
  if (filesGenerated === 0) {
    throw new Error(`No manifests generated for ${protocol} protocol. This might be a bug.`);
  }

  if (!suppressFinalLog) {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`🎉 Successfully generated ${filesGenerated} subgraph manifests for ${protocol} protocol!`);
    logger.info(`📁 Output directory: ${helpers.getRelative(manifestsDir)}`);
  }

  return filesGenerated;
}

function codegen(protocol: Types.Protocol, chainArg: string): void {
  const chain = helpers.getChain(chainArg);
  const graphChainName = getGraphChainName(chain.id);
  const manifestsDir = paths.graph.manifests(protocol);
  fs.ensureDirSync(manifestsDir);

  const manifestPath = writeManifestToFile(protocol, chain.id, graphChainName);
  logger.info(`🎉 Successfully generated subgraph manifest for ${chainArg}`);
  logger.info(`📁 Manifest path: ${manifestPath}`);
}

/**
 * Writes the subgraph manifest to a file.
 * @returns The relative path to the manifest file.
 */
function writeManifestToFile(protocol: Types.Protocol, chainId: number, chainName: string): string {
  const manifestsDir = paths.graph.manifests(protocol);
  const manifest = createGraphManifest(protocol, chainId);
  const yaml = helpers.dumpYAML(manifest);
  const manifestPath = path.join(manifestsDir, `${chainName}.yaml`);
  fs.writeFileSync(manifestPath, yaml);

  logger.verbose(`✅ Generated manifest: ${helpers.getRelative(manifestPath)}`);
  return helpers.getRelative(manifestPath);
}
