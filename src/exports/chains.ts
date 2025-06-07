import { chains, sablier } from "@sablier/deployments";
import _ from "lodash";
import type { Indexer } from "./types";

/**
 *  ⚠️ IMPORTANT
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

// Chain configuration builder
const fill = (id: number) => {
  const envioConfig = (hypersync?: string) => ({
    isEnabled: true,
    ...(hypersync && { hypersync }),
  });

  const graphConfig = () => ({
    isEnabled: true,
    name: NAME_OVERRIDES[id] || sablier.chains.getOrThrow(id).slug,
  });

  return {
    both: (hypersync?: string) => ({
      envio: envioConfig(hypersync),
      graph: graphConfig(),
      id,
    }),
    envio: (hypersync?: string) => ({
      envio: envioConfig(hypersync),
      id,
    }),
    graph: () => ({
      graph: graphConfig(),
      id,
    }),
  };
};

const both = [
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

const graphOnly = [
  fill(chains.abstract.id).graph(),
  fill(chains.berachain.id).graph(),
  fill(chains.blast.id).graph(),
  fill(chains.form.id).graph(),
  fill(chains.zksyncSepolia.id).graph(),
];

const envioOnly = [
  fill(chains.morph.id).envio("https://morph.hypersync.xyz/"),
  fill(chains.superseed.id).envio("https://extrabud.hypersync.xyz"),
  fill(chains.tangle.id).envio("https://tangle.hypersync.xyz"),
];

const all: Indexer.SupportedChain[] = [...both, ...graphOnly, ...envioOnly] as const;

export const envioChains: Indexer.Envio.Chain[] = _.filter(all, (c) => c.envio?.isEnabled) as Indexer.Envio.Chain[];
export const graphChains: Indexer.Graph.Chain[] = _.filter(all, (c) => c.graph?.isEnabled) as Indexer.Graph.Chain[];

export function getGraphChainName(chainId: number): string {
  const chain = _.find(graphChains, { id: chainId });
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not supported on The Graph`);
  }
  return chain.graph.name;
}
