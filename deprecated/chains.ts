import { ChainId, type Sablier } from "@sablier/deployments";

/** Chains supported by Sablier Indexers. */
type SupportedChain = {
  id: number;
  /** The name of the chain on The Graph. */
  name: string;
  /** The block number at which the indexer will start indexing. */
  startBlocks: {
    [K in Exclude<Sablier.Protocol, "legacy">]: number;
  };
};

export const supportedChains: SupportedChain[] = [
  // ────────────────────────────────────────────────────────────────────────────────
  // Mainnets
  // ────────────────────────────────────────────────────────────────────────────────
  {
    id: ChainId.ABSTRACT,
    name: "abstract",
    startBlocks: {
      airdrops: 73_000,
      flow: 73_000,
      lockup: 72_000,
    },
  },
  {
    id: ChainId.ARBITRUM_ONE,
    name: "arbitrum-one",
    startBlocks: {
      airdrops: 161_026_550,
      flow: 281_305_000,
      lockup: 107_509_950,
    },
  },
  {
    id: ChainId.AVALANCHE,
    name: "avalanche",
    startBlocks: {
      airdrops: 41_023_950,
      flow: 53_922_000,
      lockup: 32_164_210,
    },
  },
  {
    id: ChainId.BASE,
    name: "base",
    startBlocks: {
      airdrops: 8_026_890,
      flow: 23_269_000,
      lockup: 1_750_270,
    },
  },
  {
    id: ChainId.BERACHAIN,
    name: "berachain",
    startBlocks: {
      airdrops: 770_000,
      flow: 770_000,
      lockup: 770_000,
    },
  },
  {
    id: ChainId.BLAST,
    name: "blast",
    startBlocks: {
      airdrops: 244_700,
      flow: 12_259_000,
      lockup: 243_800,
    },
  },
  {
    id: ChainId.BSC,
    name: "bsc",
    startBlocks: {
      airdrops: 34_438_430,
      flow: 44_582_000,
      lockup: 29_646_270,
    },
  },
  {
    id: ChainId.CHILIZ,
    name: "chiliz",
    startBlocks: {
      airdrops: 19_125_000,
      flow: 19_125_000,
      lockup: 19_125_000,
    },
  },
  {
    id: ChainId.ETHEREUM,
    name: "ethereum",
    startBlocks: {
      airdrops: 17_615_650,
      flow: 21_330_000,
      lockup: 17_613_130,
    },
  },
  {
    id: ChainId.FORM,
    name: "form",
    startBlocks: {
      airdrops: 3_363_710,
      flow: 3_363_700,
      lockup: 3_359_280,
    },
  },
  {
    id: ChainId.GNOSIS,
    name: "gnosis",
    startBlocks: {
      airdrops: 31_491_790,
      flow: 37_356_000,
      lockup: 28_766_600,
    },
  },
  {
    id: ChainId.IOTEX,
    name: "iotex",
    startBlocks: {
      airdrops: 31_787_000,
      flow: 33_533_000,
      lockup: 31_786_000,
    },
  },
  {
    id: ChainId.LIGHTLINK,
    name: "lightlink",
    startBlocks: {
      airdrops: 63_526_300,
      flow: 116_397_000,
      lockup: 63_524_900,
    },
  },
  {
    id: ChainId.LINEA,
    name: "linea",
    startBlocks: {
      airdrops: 7_728_000,
      flow: 12_929_000,
      lockup: 7_728_000,
    },
  },
  {
    id: ChainId.MODE,
    name: "mode",
    startBlocks: {
      airdrops: 11_343_000,
      flow: 16_616_000,
      lockup: 11_343_000,
    },
  },
  {
    id: ChainId.MORPH,
    name: "morph",
    startBlocks: {
      airdrops: 45_000,
      flow: 980_000,
      lockup: 45_000,
    },
  },
  {
    id: ChainId.OP_MAINNET,
    name: "optimism",
    startBlocks: {
      airdrops: 113_621_900,
      flow: 128_865_000,
      lockup: 106_405_050,
    },
  },
  {
    id: ChainId.POLYGON,
    name: "polygon",
    startBlocks: {
      airdrops: 51_245_830,
      flow: 65_079_000,
      lockup: 44_637_120,
    },
  },
  {
    id: ChainId.SCROLL,
    name: "scroll",
    startBlocks: {
      airdrops: 1_675_330,
      flow: 11_643_000,
      lockup: 284_000,
    },
  },
  {
    id: ChainId.SEI,
    name: "sei",
    startBlocks: {
      airdrops: 138_911_900,
      flow: 138_911_900,
      lockup: 138_913_900,
    },
  },
  {
    id: ChainId.SUPERSEED,
    name: "superseed",
    startBlocks: {
      airdrops: 2_896_400,
      flow: 3_610_000,
      lockup: 2_896_100,
    },
  },
  {
    id: ChainId.TANGLE,
    name: "tangle",
    startBlocks: {
      airdrops: 2_516_000,
      flow: 3_296_000,
      lockup: 2_515_000,
    },
  },
  {
    id: ChainId.ULTRA,
    name: "ultra",
    startBlocks: {
      airdrops: 4_858_600,
      flow: 4_858_900,
      lockup: 4_858_700,
    },
  },
  {
    id: ChainId.UNICHAIN,
    name: "unichain",
    startBlocks: {
      airdrops: 13_882_000,
      flow: 13_882_000,
      lockup: 13_882_000,
    },
  },
  {
    id: ChainId.XDC,
    name: "xdc",
    startBlocks: {
      airdrops: 85_226_400,
      flow: 85_226_800,
      lockup: 85_225_600,
    },
  },
  {
    id: ChainId.ZK_SYNC_ERA,
    name: "zksync",
    startBlocks: {
      airdrops: 33_148_900,
      flow: 50_572_000,
      lockup: 32_472_500,
    },
  },
  // ────────────────────────────────────────────────────────────────────────────────
  // Testnets
  // ────────────────────────────────────────────────────────────────────────────────
  {
    id: ChainId.ARBITRUM_SEPOLIA,
    name: "arbitrum-sepolia",
    startBlocks: {
      airdrops: 2_972_050,
      flow: 103_460_000,
      lockup: 2_838_600,
    },
  },
  {
    id: ChainId.BASE_SEPOLIA,
    name: "base-sepolia",
    startBlocks: {
      airdrops: 12_641_000,
      flow: 18_780_000,
      lockup: 12_641_000,
    },
  },
  {
    id: ChainId.ETHEREUM_SEPOLIA,
    name: "sepolia",
    startBlocks: {
      airdrops: 4_904_890,
      flow: 7_210_000,
      lockup: 4_067_889,
    },
  },
  {
    id: ChainId.OP_SEPOLIA,
    name: "optimism-sepolia",
    startBlocks: {
      airdrops: 7_452_580,
      flow: 20_763_000,
      lockup: 7_451_810,
    },
  },
  {
    id: ChainId.ZK_SYNC_SEPOLIA,
    name: "zksync-sepolia",
    startBlocks: {
      airdrops: 3_250_000,
      flow: 4_276_000,
      lockup: 3_240_000,
    },
  },
];
