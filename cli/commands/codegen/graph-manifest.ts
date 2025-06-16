/**
 * @file CLI for generating subgraph manifests
 *
 * @example
 * pnpm tsx cli codegen graph-manifest --protocol all --chain all
 * pnpm tsx cli codegen graph-manifest --protocol all --chain polygon
 * pnpm tsx cli codegen graph-manifest --protocol flow --chain polygon
 *
 * @param --protocol - Required: 'airdrops', 'flow', 'lockup', or 'all'
 * @param --chain - Required: The chain slug to generate manifests for.
 * Use 'all' to generate for all chains.
 */

import * as path from "node:path";
import { type Command } from "commander";
import * as fs from "fs-extra";
import _ from "lodash";
import { sablier } from "sablier";
import { createGraphManifest } from "../../../src/codegen/graph-manifest";
import { graphConfigs } from "../../../src/exports/vendors";
import paths from "../../../src/paths";
import type { Types } from "../../../src/types";
import { logger } from "../../../src/winston";
import { PROTOCOLS } from "../../constants";
import * as helpers from "../../helpers";

/* -------------------------------------------------------------------------- */
/*                                  COMMAND                                   */
/* -------------------------------------------------------------------------- */

export function createGraphManifestCommand(): Command {
  const command = helpers.createBaseCommand("Generate subgraph manifests");
  helpers.addProtocolOption(command);
  helpers.addChainOption(command);

  command.action(async (options) => {
    const protocolArg = helpers.parseProtocolOption(options.protocol);
    const chainArg = helpers.parseChainOption(options.chain);

    if (protocolArg === "all") {
      generateAllProtocolManifests(chainArg);
      return;
    }

    if (chainArg === "all") {
      generateAllChainManifests(protocolArg);
      return;
    }

    generateManifest(protocolArg, chainArg);
  });

  return command;
}

export const command = createGraphManifestCommand();

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function generateAllProtocolManifests(chainArg: string) {
  let totalCount = 0;

  for (const p of PROTOCOLS) {
    if (chainArg === "all") {
      const filesGenerated = generateAllChainManifests(p, true);
      totalCount += filesGenerated;
      logger.info(`✅ Generated ${filesGenerated} manifests for protocol ${_.capitalize(p)}`);
      continue;
    }

    generateManifest(p, chainArg);
  }

  if (chainArg === "all") {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(`🎉 Successfully generated ${totalCount} manifests in total!\n`);
  }
}

function generateAllChainManifests(protocol: Types.Protocol, suppressFinalLog = false): number {
  const manifestsDir = paths.graph.manifests(protocol);

  if (fs.pathExistsSync(manifestsDir)) {
    fs.emptyDirSync(manifestsDir);
    fs.ensureFileSync(path.join(manifestsDir, ".gitkeep"));
    logger.verbose("🗑️ Cleared existing manifests directory");
  }

  let filesGenerated = 0;
  for (const config of graphConfigs) {
    writeManifestToFile(protocol, config.chainId);
    filesGenerated++;
  }
  if (filesGenerated === 0) {
    throw new Error(`No manifests generated for protocol ${_.capitalize(protocol)}. This is a bug.`);
  }

  if (!suppressFinalLog) {
    logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    logger.info(
      `🎉 Successfully generated ${filesGenerated} subgraph manifests for protocol ${_.capitalize(protocol)}!`,
    );
    logger.info(`📁 Output directory: ${helpers.getRelative(manifestsDir)}`);
  }

  return filesGenerated;
}

function generateManifest(protocol: Types.Protocol, chainArg: string): void {
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
