/**
 * @file CLI for generating subgraph manifests
 *
 * @example
 * pnpm tsx cli codegen graph-manifest --protocol all --chain all
 * pnpm tsx cli codegen graph-manifest --protocol all --chain polygon
 * pnpm tsx cli codegen graph-manifest --protocol flow --chain polygon
 *
 * @param {string} --protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param {string} --chain - Required: The chain slug to generate manifests for.
 * Use 'all' to generate for all chains.
 */
import * as path from "node:path";
import { sablier } from "@sablier/deployments";
import * as fs from "fs-extra";
import { createGraphManifest } from "../../src/codegen/graph-manifest";
import { GRAPH_CONFIGS } from "../../src/exports/vendors";
import paths from "../../src/paths";
import type { Types } from "../../src/types";
import { logger } from "../../src/winston";
import { PROTOCOLS } from "../constants";
import * as helpers from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

export async function main(): Promise<void> {
  const program = helpers.createBaseCommand("Generate subgraph manifests");
  helpers.addProtocolOption(program);
  helpers.addChainOption(program);
  program.parse();

  const options = program.opts();
  const protocolArg = helpers.parseProtocolOption(options.protocol);
  const chainArg = helpers.parseChainOption(options.chain);

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
  for (const config of GRAPH_CONFIGS) {
    writeManifestToFile(protocol, config.chainId);
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
  const manifestsDir = paths.graph.manifests(protocol);
  fs.ensureDirSync(manifestsDir);

  const manifestPath = writeManifestToFile(protocol, chain.id);
  logger.info(`🎉 Successfully generated subgraph manifest for ${chainArg}`);
  logger.info(`📁 Manifest path: ${manifestPath}`);
}

/**
 * Writes the subgraph manifest to a file.
 * @returns The relative path to the manifest file.
 */
function writeManifestToFile(protocol: Types.Protocol, chainId: number): string {
  const manifestsDir = paths.graph.manifests(protocol);
  const manifest = createGraphManifest(protocol, chainId);
  const yaml = helpers.dumpYAML(manifest);
  const chain = sablier.chains.getOrThrow(chainId);
  const manifestPath = path.join(manifestsDir, `${chain.slug}.yaml`);
  fs.writeFileSync(manifestPath, yaml);

  logger.verbose(`✅ Generated manifest: ${helpers.getRelative(manifestPath)}`);
  return helpers.getRelative(manifestPath);
}
