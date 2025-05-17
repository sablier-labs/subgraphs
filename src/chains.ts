import { ChainId } from "@sablier/deployments";
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
  /*                                  Mainnets                                  */
  /* -------------------------------------------------------------------------- */
  {
    id: ChainId.ABSTRACT,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "abstract",
    },
  },
  {
    id: ChainId.ARBITRUM_ONE,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "arbitrum-one",
    },
  },
  {
    id: ChainId.AVALANCHE,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "avalanche",
    },
  },
  {
    id: ChainId.BASE,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "base",
    },
  },
  {
    id: ChainId.BERACHAIN,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "berachain",
    },
  },
  {
    id: ChainId.BLAST,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "blast",
    },
  },
  {
    id: ChainId.BSC,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "bsc",
    },
  },
  {
    id: ChainId.CHILIZ,
    envio: {
      hypersync: "https://chiliz.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "chiliz",
    },
  },
  {
    id: ChainId.ETHEREUM,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "ethereum",
    },
  },
  {
    id: ChainId.FORM,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "form",
    },
  },
  {
    id: ChainId.GNOSIS,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "gnosis",
    },
  },
  {
    id: ChainId.IOTEX,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "iotex",
    },
  },
  {
    id: ChainId.LIGHTLINK,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "lightlink",
    },
  },
  {
    id: ChainId.LINEA,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "linea",
    },
  },
  {
    id: ChainId.MODE,
    envio: {
      hypersync: "https://mode.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "mode",
    },
  },
  {
    id: ChainId.MORPH,
    envio: {
      hypersync: "https://morph.hypersync.xyz/",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "morph",
    },
  },
  {
    id: ChainId.OP_MAINNET,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "optimism",
    },
  },
  {
    id: ChainId.POLYGON,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "polygon",
    },
  },
  {
    id: ChainId.SCROLL,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "scroll",
    },
  },
  {
    id: ChainId.SEI,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "sei",
    },
  },
  {
    id: ChainId.SUPERSEED,
    envio: {
      hypersync: "https://extrabud.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "superseed",
    },
  },
  {
    id: ChainId.TANGLE,
    envio: {
      hypersync: "https://tangle.hypersync.xyz",
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "tangle",
    },
  },
  {
    id: ChainId.ULTRA,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "ultra",
    },
  },
  {
    id: ChainId.UNICHAIN,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "unichain",
    },
  },
  {
    id: ChainId.XDC,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "xdc",
    },
  },
  {
    id: ChainId.ZK_SYNC_ERA,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "zksync",
    },
  },
  /* -------------------------------------------------------------------------- */
  /*                                  Testnets                                  */
  /* -------------------------------------------------------------------------- */
  {
    id: ChainId.ARBITRUM_SEPOLIA,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "arbitrum-sepolia",
    },
  },
  {
    id: ChainId.BASE_SEPOLIA,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "base-sepolia",
    },
  },
  {
    id: ChainId.ETHEREUM_SEPOLIA,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "sepolia",
    },
  },
  {
    id: ChainId.OP_SEPOLIA,
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "optimism-sepolia",
    },
  },
  {
    id: ChainId.ZK_SYNC_SEPOLIA,
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "zksync-sepolia",
    },
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
