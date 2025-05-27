import { chains, queries } from "@sablier/deployments";
import _ from "lodash";

type SupportedChain = {
  id: number;
  envio?: { isEnabled: boolean; hypersync?: string };
  graph?: { isEnabled: boolean; name: string };
};

type EnvioChain = SupportedChain & {
  envio: { isEnabled: boolean; hypersync?: string };
  graph: never;
};

type GraphChain = SupportedChain & {
  envio: never;
  graph: { isEnabled: boolean; name: string };
};

// Most chains' names on The Graph are the same as the chain's slug, but some are not.
// See https://thegraph.com/docs/en/supported-networks
const overrides: { [chainId: number]: string } = {
  [chains.arbitrum.id]: "arbitrum-one",
  [chains.blast.id]: "blast-mainnet",
  [chains.ethereumSepolia.id]: "sepolia",
  [chains.mode.id]: "mode-mainnet",
  [chains.sei.id]: "sei-mainnet",
};

// Chain configuration builder
const fill = (id: number) => ({
  both: (hypersync?: string) => ({
    envio: { isEnabled: true, ...(hypersync && { hypersync }) },
    graph: { isEnabled: true, name: overrides[id] || queries.chains.getOrThrow(id).slug },
    id,
  }),
  envio: (hypersync?: string) => ({
    envio: { hypersync, isEnabled: true },
    id,
  }),
  graph: () => ({
    graph: { isEnabled: true, name: overrides[id] || queries.chains.getOrThrow(id).slug },
    id,
  }),
});

const supportedChains: SupportedChain[] = [
  /* ---------------------------------- BOTH ---------------------------------- */
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

  /* ------------------------------- ENVIO-ONLY ------------------------------- */
  fill(chains.morph.id).envio("https://morph.hypersync.xyz/"),
  fill(chains.superseed.id).envio("https://extrabud.hypersync.xyz"),
  fill(chains.tangle.id).envio("https://tangle.hypersync.xyz"),

  /* ------------------------------- GRAPH-ONLY ------------------------------- */
  fill(chains.abstract.id).graph(),
  fill(chains.berachain.id).graph(),
  fill(chains.blast.id).graph(),
  fill(chains.form.id).graph(),
  fill(chains.zksyncSepolia.id).graph(),
];

export const envioChains: EnvioChain[] = _.filter(supportedChains, (c) => c.envio?.isEnabled) as EnvioChain[];
export const graphChains: GraphChain[] = _.filter(supportedChains, (c) => c.graph?.isEnabled) as GraphChain[];

export function getGraphChainName(chainId: number): string {
  const chain = graphChains.find((chain) => chain.id === chainId);
  if (!chain) {
    throw new Error(`Chain with ID ${chainId} not supported on The Graph`);
  }
  return chain.graph.name;
}
