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
    id: ChainId.ABSTRACT,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "arbitrum-one",
    },
    id: ChainId.ARBITRUM_ONE,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "avalanche",
    },
    id: ChainId.AVALANCHE,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "base",
    },
    id: ChainId.BASE,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "berachain",
    },
    id: ChainId.BERACHAIN,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "blast",
    },
    id: ChainId.BLAST,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "bsc",
    },
    id: ChainId.BSC,
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
    id: ChainId.CHILIZ,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "ethereum",
    },
    id: ChainId.ETHEREUM,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "form",
    },
    id: ChainId.FORM,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "gnosis",
    },
    id: ChainId.GNOSIS,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "iotex",
    },
    id: ChainId.IOTEX,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "lightlink",
    },
    id: ChainId.LIGHTLINK,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "linea",
    },
    id: ChainId.LINEA,
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
    id: ChainId.MODE,
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
    id: ChainId.MORPH,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "optimism",
    },
    id: ChainId.OP_MAINNET,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "polygon",
    },
    id: ChainId.POLYGON,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "scroll",
    },
    id: ChainId.SCROLL,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "sei",
    },
    id: ChainId.SEI,
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
    id: ChainId.SUPERSEED,
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
    id: ChainId.TANGLE,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "unichain",
    },
    id: ChainId.UNICHAIN,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "xdc",
    },
    id: ChainId.XDC,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "zksync",
    },
    id: ChainId.ZK_SYNC_ERA,
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
    id: ChainId.ARBITRUM_SEPOLIA,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "base-sepolia",
    },
    id: ChainId.BASE_SEPOLIA,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "sepolia",
    },
    id: ChainId.ETHEREUM_SEPOLIA,
  },
  {
    envio: {
      isEnabled: true,
    },
    graph: {
      isEnabled: true,
      name: "optimism-sepolia",
    },
    id: ChainId.OP_SEPOLIA,
  },
  {
    envio: {
      isEnabled: false,
    },
    graph: {
      isEnabled: true,
      name: "zksync-sepolia",
    },
    id: ChainId.ZK_SYNC_SEPOLIA,
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
