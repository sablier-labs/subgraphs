import { chains, sablier } from "@sablier/deployments";
import _ from "lodash";
import type { Indexer } from "./types";

/**
 * ⚠️ IMPORTANT
 * Not all names on The Graph are the same as the chain's slug from the deployments package.
 *
 * @see https://github.com/sablierhq/deployments
 * @see https://thegraph.com/docs/en/supported-networks
 */
const NAME_OVERRIDES: { [chainId: number]: string } = {
  [chains.arbitrum.id]: "arbitrum-one",
  [chains.blast.id]: "blast-mainnet",
  [chains.ethereum.id]: "mainnet",
  [chains.ethereumSepolia.id]: "sepolia",
  [chains.mode.id]: "mode-mainnet",
  [chains.sei.id]: "sei-mainnet",
};

/**
 * Utility for building chain configs.
 */
const fill = (chainId: number) => {
  const envioConfig = (hypersync?: string) => ({
    hypersync,
  });

  const graphConfig = () => ({
    name: NAME_OVERRIDES[chainId] || sablier.chains.getOrThrow(chainId).slug,
  });

  return {
    both: (hypersync?: string) => ({
      chainId,
      envio: envioConfig(hypersync),
      graph: graphConfig(),
    }),
    envio: (hypersync?: string) => ({
      chainId,
      envio: envioConfig(hypersync),
    }),
    graph: () => ({
      chainId,
      graph: graphConfig(),
    }),
  };
};

/**
 * Chains indexed by both The Graph and Envio.
 */
const COMMON = [
  fill(chains.arbitrumSepolia.id).both(),
  fill(chains.arbitrum.id).both(),
  fill(chains.avalanche.id).both(),
  fill(chains.base.id).both(),
  fill(chains.baseSepolia.id).both(),
  fill(chains.bsc.id).both(),
  fill(chains.chiliz.id).both("https://chiliz.hypersync.xyz"),
  fill(chains.ethereum.id).both(),
  fill(chains.ethereumSepolia.id).both(),
  fill(chains.gnosis.id).both(),
  fill(chains.iotex.id).graph(),
  fill(chains.lightlink.id).graph(),
  fill(chains.linea.id).both(),
  fill(chains.mode.id).both("https://mode.hypersync.xyz"),
  fill(chains.optimism.id).both(),
  fill(chains.optimismSepolia.id).both(),
  fill(chains.polygon.id).both(),
  fill(chains.scroll.id).both(),
  fill(chains.sei.id).graph(),
  fill(chains.unichain.id).graph(),
  fill(chains.xdc.id).graph(),
  fill(chains.zksync.id).both(),
];

/**
 * Chains indexed by The Graph only.
 * @see https://thegraph.com/docs/en/supported-networks
 */
const GRAPH_ONLY = [
  fill(chains.abstract.id).graph(),
  fill(chains.berachain.id).graph(),
  fill(chains.blast.id).graph(),
  fill(chains.form.id).graph(),
  fill(chains.zksyncSepolia.id).graph(),
];

/**
 * Chains indexed by Envio only.
 * @see https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks
 */
const ENVIO_ONLY = [
  fill(chains.morph.id).envio("https://morph.hypersync.xyz"),
  fill(chains.sophon.id).envio("https://sophon.hypersync.xyz"),
  fill(chains.superseed.id).envio("https://superseed.hypersync.xyz"),
  fill(chains.tangle.id).envio("https://tangle.hypersync.xyz"),
];

const ALL = [...COMMON, ...GRAPH_ONLY, ...ENVIO_ONLY] as const;

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

export const envioConfigs: Indexer.EnvioConfig[] = ALL.filter((c) => "envio" in c).map((c) => ({
  chainId: c.chainId,
  hypersync: c.envio.hypersync,
}));

export const graphConfigs: Indexer.GraphConfig[] = ALL.filter((c) => "graph" in c).map((c) => ({
  chainId: c.chainId,
  name: c.graph.name,
}));

export function getGraphChainName(chainId: number): string {
  const chain = _.find(graphConfigs, { chainId });
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not supported on The Graph`);
  }
  return chain.name;
}
