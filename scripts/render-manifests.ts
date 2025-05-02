import * as fs from "node:fs";
import * as path from "node:path";
import { getDeployment, getFirstReleaseForChain } from "@sablier/deployments";
import type { Sablier } from "@sablier/deployments";
import * as Handlebars from "handlebars";
import _ from "lodash";
import { supportedChains } from "../src/chains";
import { names as contractNames } from "../src/contracts";
import logger from "./logger";

/*//////////////////////////////////////////////////////////////////////////
                                    CLI
//////////////////////////////////////////////////////////////////////////*/

/**
 * CLI for generating subgraph manifests
 *
 * @example Generate manifest for a specific protocol and chain:
 * bun run src/render.ts flow mainnet
 *
 * @example Generate manifests for a protocol across all supported chains:
 * bun run src/render.ts flow
 *
 * @example Use verbose logging:
 * bun run src/render.ts flow --verbose
 *
 * @param {string} protocol - Required. Either 'flow' or 'lockup'
 * @param {string} [chainName] - Optional. Name of the chain (e.g., 'mainnet', 'polygon')
 * @param {boolean} [--verbose] - Optional flag. Display detailed logs during execution
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const verboseIndex = args.indexOf("--verbose");
  const isVerbose = verboseIndex !== -1;

  // Remove verbose flag from args if present
  if (verboseIndex !== -1) {
    args.splice(verboseIndex, 1);
  }

  const protocolArg = args[0];
  const chainNameArg = args[1];

  const processProtocol = (protocol: Exclude<Sablier.Protocol, "legacy">) => {
    if (chainNameArg) {
      // Render a single manifest
      const result = renderManifestForChain(chainNameArg, protocol, { verbose: isVerbose });
      if (!result.success) {
        logger.error(`❌ Error: ${result.error}`);
        return false;
      }
      // Always show success message for single chain manifest generation
      logger.info(`🎉 Successfully generated the subgraph manifest for ${chainNameArg}`);
      logger.info(`📁 Manifest path: ${result.relativeOutputPath}`);
    } else {
      // Render all manifests
      renderManifestsForAllChains(protocol, { verbose: isVerbose });
    }
    return true;
  };

  // If no protocol is specified, generate for all protocols
  if (!protocolArg) {
    logger.info("No protocol specified. Generating manifests for all protocols...");
    const protocols = ["flow", "lockup"] as const;
    const results = protocols.map((protocol) => {
      logger.info(`📄 Processing ${protocol} protocol:`);
      return processProtocol(protocol);
    });

    if (results.some((success) => !success)) {
      process.exit(1);
    }
  } else {
    if (!["flow", "lockup"].includes(protocolArg)) {
      logger.error("❌ Error: Protocol argument must be either 'flow' or 'lockup'");
      process.exit(1);
    }

    if (!processProtocol(protocolArg as Exclude<Sablier.Protocol, "legacy">)) {
      process.exit(1);
    }
  }
}

/*//////////////////////////////////////////////////////////////////////////
                                  EXPORTS
//////////////////////////////////////////////////////////////////////////*/

export function renderManifestForChain(
  chainName: string,
  protocol: Exclude<Sablier.Protocol, "legacy">,
  options: {
    outputDir?: string;
    templateDir?: string;
    verbose?: boolean;
  } = {},
) {
  const { templateDir, outputDir } = options;

  // Validate protocol argument
  if (!protocol || !["flow", "lockup"].includes(protocol)) {
    throw new Error("Protocol argument must be either 'flow' or 'lockup'");
  }

  const TEMPLATE_DIR = templateDir || path.join(__dirname, "../the-graph");
  const TEMPLATE_PATH = path.join(TEMPLATE_DIR, `${protocol}/manifest.yaml`);
  const OUTPUT_DIR = outputDir || path.join(TEMPLATE_DIR, `${protocol}/manifests`);

  // Find the chain by name
  const chain = findChainByName(chainName);
  if (!chain) {
    // Get available chain names for better error message
    const availableChains = supportedChains.map((chain) => chain.name).join(", ");
    return {
      success: false,
      error: `Chain with name "${chainName}" not found in supported chains.\nAvailable chains: ${availableChains}`,
    };
  }
  const release = getFirstReleaseForChain(protocol, chain.id);
  const deployment = getDeployment(release, chain.id);

  if (!deployment) {
    return {
      success: false,
      error: `No deployment found for the first release of ${protocol} on ${chain.name}`,
    };
  }

  const initializer = findInitializerContract(protocol, deployment);
  if (!initializer) {
    return {
      success: false,
      error: `No initializer found for ${protocol} on ${chain.name}`,
    };
  }

  const startBlock = chain.startBlocks[protocol];
  if (!startBlock) {
    return {
      success: false,
      error: `Start block not found for ${protocol} on ${chain.name}`,
    };
  }

  try {
    const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
    const renderer = Handlebars.compile(template);

    const data: ManifestData = {
      chainId: chain.id,
      chainName: chain.name,
      initializerAddress: initializer.address.toLowerCase(),
      startBlock,
    };

    const result = renderer(data);
    const outputPath = path.join(OUTPUT_DIR, `${chain.name}.yaml`);
    fs.writeFileSync(outputPath, result);

    logger.verbose(`✅ Generated subgraph manifest for ${chain.name} (ID ${chain.id}) at: ${getRelative(outputPath)}`);

    return {
      chain,
      manifestData: data,
      outputPath,
      relativeOutputPath: getRelative(outputPath),
      success: true,
    };
  } catch (error) {
    return {
      error: `Error rendering manifest: ${error instanceof Error ? error.message : String(error)}`,
      success: false,
    };
  }
}

/**
 * Renders manifests for all supported chains
 * @param protocol The Sablier protocol to use ("flow" or "lockup")
 * @param options Optional configuration
 * @returns Number of successfully generated manifests
 */
export function renderManifestsForAllChains(
  protocol: Exclude<Sablier.Protocol, "legacy">,
  options: {
    clearExisting?: boolean;
    outputDir?: string;
    templateDir?: string;
    verbose?: boolean;
  } = {},
) {
  const { verbose = false, templateDir, outputDir, clearExisting = true } = options;

  const TEMPLATE_DIR = templateDir || path.join(__dirname, "../the-graph");
  const OUTPUT_DIR = outputDir || path.join(TEMPLATE_DIR, `${protocol}/manifests`);

  // Delete existing manifests if requested
  if (clearExisting && fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    for (const file of files) {
      if (file.endsWith(".yaml")) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
        logger.verbose(`🗑️  Deleted existing manifest: ${file}`);
      }
    }
  }

  let filesGenerated = 0;

  for (const chain of supportedChains) {
    const result = renderManifestForChain(chain.name, protocol, {
      outputDir,
      templateDir,
      verbose,
    });

    if (result.success) {
      filesGenerated++;
    }
  }

  logger.verbose("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  logger.info(`🎉 Successfully generated ${filesGenerated} subgraph manifest${filesGenerated !== 1 ? "s" : ""}!`);
  logger.info(`📁 Output directory: ${getRelative(OUTPUT_DIR)}`);

  return filesGenerated;
}

/*//////////////////////////////////////////////////////////////////////////
                                  INTERNAL
//////////////////////////////////////////////////////////////////////////*/

type ManifestData = {
  chainId: number;
  chainName: string;
  initializerAddress: string;
  startBlock: number;
};

function findChainByName(chainName: string) {
  return supportedChains.find((chain) => chain.name.toLowerCase() === chainName.toLowerCase());
}

function findInitializerContract(
  protocol: Exclude<Sablier.Protocol, "legacy">,
  deployment: Sablier.Deployment,
): Sablier.Contract | undefined {
  // Determine which contract names to look for based on protocol
  const initializersToFind =
    protocol === "flow"
      ? [contractNames.SABLIER_FLOW]
      : [contractNames.SABLIER_V2_LOCKUP_LINEAR, contractNames.SABLIER_LOCKUP];

  const initializer = _.find(deployment.contracts, (contract) => initializersToFind.includes(contract.name));
  return initializer;
}

function getRelative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath);
}
