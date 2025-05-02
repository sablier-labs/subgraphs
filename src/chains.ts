import { ChainId } from "@sablier/deployments";

/** Chains supported by Sablier Indexers. */
type SupportedChain = {
  id: number;
  /** The name of the chain on The Graph, which may not be the same as Sablier's name. */
  name: string;
};

export const supportedChains: SupportedChain[] = [
  // ────────────────────────────────────────────────────────────────────────────────
  // Mainnets
  // ────────────────────────────────────────────────────────────────────────────────
  {
    id: ChainId.ABSTRACT,
    name: "abstract",
  },
  {
    id: ChainId.ARBITRUM_ONE,
    name: "arbitrum-one",
  },
  {
    id: ChainId.AVALANCHE,
    name: "avalanche",
  },
  {
    id: ChainId.BASE,
    name: "base",
  },
  {
    id: ChainId.BERACHAIN,
    name: "berachain",
  },
  {
    id: ChainId.BLAST,
    name: "blast",
  },
  {
    id: ChainId.BSC,
    name: "bsc",
  },
  {
    id: ChainId.CHILIZ,
    name: "chiliz",
  },
  {
    id: ChainId.ETHEREUM,
    name: "ethereum",
  },
  {
    id: ChainId.FORM,
    name: "form",
  },
  {
    id: ChainId.GNOSIS,
    name: "gnosis",
  },
  {
    id: ChainId.IOTEX,
    name: "iotex",
  },
  {
    id: ChainId.LIGHTLINK,
    name: "lightlink",
  },
  {
    id: ChainId.LINEA,
    name: "linea",
  },
  {
    id: ChainId.MODE,
    name: "mode",
  },
  {
    id: ChainId.MORPH,
    name: "morph",
  },
  {
    id: ChainId.OP_MAINNET,
    name: "optimism",
  },
  {
    id: ChainId.POLYGON,
    name: "polygon",
  },
  {
    id: ChainId.SCROLL,
    name: "scroll",
  },
  {
    id: ChainId.SEI,
    name: "sei",
  },
  {
    id: ChainId.SUPERSEED,
    name: "superseed",
  },
  {
    id: ChainId.TANGLE,
    name: "tangle",
  },
  {
    id: ChainId.ULTRA,
    name: "ultra",
  },
  {
    id: ChainId.UNICHAIN,
    name: "unichain",
  },
  {
    id: ChainId.XDC,
    name: "xdc",
  },
  {
    id: ChainId.ZK_SYNC_ERA,
    name: "zksync",
  },
  // ────────────────────────────────────────────────────────────────────────────────
  // Testnets
  // ────────────────────────────────────────────────────────────────────────────────
  {
    id: ChainId.ARBITRUM_SEPOLIA,
    name: "arbitrum-sepolia",
  },
  {
    id: ChainId.BASE_SEPOLIA,
    name: "base-sepolia",
  },
  {
    id: ChainId.ETHEREUM_SEPOLIA,
    name: "sepolia",
  },
  {
    id: ChainId.OP_SEPOLIA,
    name: "optimism-sepolia",
  },
  {
    id: ChainId.ZK_SYNC_SEPOLIA,
    name: "zksync-sepolia",
  },
];
