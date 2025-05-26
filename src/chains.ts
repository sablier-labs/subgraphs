import { chains } from "@sablier/deployments";
import { logAndThrow } from "./winston";

type EnvioConfig = {
  isEnabled: boolean;
  hypersync?: string;
};

type GraphConfig = {
  isEnabled: boolean;
  name: string;
};

type SupportedChain = {
  id: number;
  envio?: EnvioConfig;
  graph?: GraphConfig;
};

type EnvioChain = SupportedChain & {
  envio: EnvioConfig;
  graph: never;
};

type GraphChain = SupportedChain & {
  envio: never;
  graph: GraphConfig;
};

export const supportedChains: SupportedChain[] = [
  /* -------------------------------------------------------------------------- */
  /*                                  MAINNETS                                  */
  /* -------------------------------------------------------------------------- */
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "abstract",
    },
    id: chains.abstract.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "arbitrum-one",
    },
    id: chains.arbitrum.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "avalanche",
    },
    id: chains.avalanche.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "base",
    },
    id: chains.base.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "berachain",
    },
    id: chains.berachain.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "blast",
    },
    id: chains.blast.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "bsc",
    },
    id: chains.bsc.id,
  },
  {
    envio: {
      hypersync: "https://chiliz.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "chiliz",
    },
    id: chains.chiliz.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "ethereum",
    },
    id: chains.ethereum.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "form",
    },
    id: chains.form.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "gnosis",
    },
    id: chains.gnosis.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "iotex",
    },
    id: chains.iotex.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "lightlink",
    },
    id: chains.lightlink.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "linea",
    },
    id: chains.linea.id,
  },
  {
    envio: {
      hypersync: "https://mode.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "mode",
    },
    id: chains.mode.id,
  },
  {
    envio: {
      hypersync: "https://morph.hypersync.xyz/",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "morph",
    },
    id: chains.morph.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "optimism",
    },
    id: chains.optimism.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "polygon",
    },
    id: chains.polygon.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "scroll",
    },
    id: chains.scroll.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "sei",
    },
    id: chains.sei.id,
  },
  {
    envio: {
      hypersync: "https://extrabud.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "superseed",
    },
    id: chains.superseed.id,
  },
  {
    envio: {
      hypersync: "https://tangle.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "tangle",
    },
    id: chains.tangle.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "unichain",
    },
    id: chains.unichain.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "xdc",
    },
    id: chains.xdc.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "zksync",
    },
    id: chains.zksync.id,
  },
  /* -------------------------------------------------------------------------- */
  /*                                  TESTNETS                                  */
  /* -------------------------------------------------------------------------- */
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "arbitrum-sepolia",
    },
    id: chains.arbitrumSepolia.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "base-sepolia",
    },
    id: chains.baseSepolia.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "sepolia",
    },
    id: chains.ethereumSepolia.id,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "optimism-sepolia",
    },
    id: chains.optimismSepolia.id,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "zksync-sepolia",
    },
    id: chains.zksyncSepolia.id,
  },
];

export const envioChains: EnvioChain[] = supportedChains.filter((chain) => chain.envio?.isEnabled) as EnvioChain[];

export const graphChains: GraphChain[] = supportedChains.filter((chain) => chain.graph?.isEnabled) as GraphChain[];

export function getChainName(chainId: number): string {
  const chain = supportedChains.find((chain) => chain.id === chainId);
  const chainName = chain?.graph?.name;
  if (!chainName) {
    logAndThrow(`Chain with ID ${chainId} not supported`);
  }
  return chainName;
}
