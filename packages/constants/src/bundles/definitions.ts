// @ts-ignore
import type { Chain } from "viem";
// @ts-ignore
import { defineChain } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  gnosis,
  linea,
  mainnet,
  mode,
  optimism,
  polygon,
  scroll,
  sepolia,
  zksync, // @ts-ignore
} from "viem/chains";

const definitions: Record<string, [Chain, string[]]> = {
  mainnet: [
    mainnet,
    [
      "https://rpc.ankr.com/eth",
      "https://eth.llamarpc.com",
      "https://ethereum.publicnode.com",
      "https://eth-mainnet.public.blastapi.io",
      "https://rpc.tornadoeth.cash/eth",
    ],
  ],
  arbitrum: [
    arbitrum,
    [
      "https://arbitrum.llamarpc.com",
      "https://arb-pokt.nodies.app",
      "https://endpoints.omniatech.io/v1/arbitrum/one/public",
      "https://rpc.tornadoeth.cash/arbitrum",
      "https://rpc.ankr.com/arbitrum",
    ],
  ],
  avalanche: [
    avalanche,
    [
      "https://avalanche.public-rpc.com",
      "https://avalanche.drpc.org",
      "https://api.avax.network/ext/bc/C/rpc",
      "https://rpc.ankr.com/avalanche",
      "https://avax.meowrpc.com",
    ],
  ],
  base: [
    base,
    [
      "https://base.llamarpc.com",
      "https://base-pokt.nodies.app",
      "https://base-mainnet.public.blastapi.io",
      "https://base.drpc.org",
      "https://base.meowrpc.com",
    ],
  ],
  blast: [
    blast,
    [
      "https://rpc.ankr.com/blast",
      "https://blast.din.dev/rpc",
      "https://blastl2-mainnet.public.blastapi.io",
      "https://blast.blockpi.network/v1/rpc/public",
    ],
  ],
  bsc: [
    bsc,
    [
      "https://binance.llamarpc.com",
      "https://binance.nodereal.io",
      "https://rpc.ankr.com/bsc",
      "https://rpc.tornadoeth.cash/bsc",
      "https://bsc-mainnet.public.blastapi.io",
    ],
  ],
  gnosis: [
    gnosis,
    [
      "https://rpc.ankr.com/gnosis",
      "https://gnosis-mainnet.public.blastapi.io",
      "https://rpc.gnosischain.com",
      "https://gnosis.drpc.org",
      "https://rpc.tornadoeth.cash/gnosis",
    ],
  ],
  linea: [
    linea,
    [
      "https://linea.blockpi.network/v1/rpc/public",
      "https://rpc.linea.build",
      "https://1rpc.io/linea",
    ],
  ],
  optimism: [
    optimism,
    [
      "https://optimism.llamarpc.com",
      "https://rpc.ankr.com/optimism",
      "https://optimism.publicnode.com",
      "https://optimism.meowrpc.com",
      "https://rpc.tornadoeth.cash/optimism",
    ],
  ],
  polygon: [
    polygon,
    [
      "https://polygon.llamarpc.com",
      "https://polygon-mainnet.public.blastapi.io",
      "https://polygon.drpc.org",
      "https://polygon-rpc.com",
      "https://rpc.ankr.com/polygon",
    ],
  ],
  scroll: [
    scroll,
    [
      "https://rpc.ankr.com/scroll",
      "https://rpc-scroll.icecreamswap.com",
      "https://scroll-mainnet.public.blastapi.io",
      "https://rpc.scroll.io",
      "https://scroll-mainnet.chainstacklabs.com",
    ],
  ],
  sepolia: [
    sepolia,
    [
      "https://gateway.tenderly.co/public/sepolia",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      "https://1rpc.io/sepolia",
      "https://gateway.tenderly.co/public/sepolia",
      "https://rpc2.sepolia.org",
    ],
  ],
  zksync: [
    zksync,
    [
      "https://mainnet.era.zksync.io",
      "https://1rpc.io/zksync2-era",
      "https://endpoints.omniatech.io/v1/zksync-era/mainnet/public",
    ],
  ],
  mode: [
    mode,
    [
      "https://mainnet.mode.network",
      "https://mode.gateway.tenderly.co",
      "https://1rpc.io/mode",
    ],
  ],
  morph: [
    defineChain({
      id: 2818,
      name: "Morph",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: ["https://rpc.morphl2.io"],
          webSocket: ["wss://rpc.morphl2.io:8443"],
        },
      },
      blockExplorers: {
        default: {
          name: "Morph Explorer",
          url: "https://explorer.morphl2.io",
        },
      },
      testnet: false,
      contracts: {
        multicall3: {
          address: "0x33A213b1049D5AD2eeE6e61dAe040955e60383D4",
          blockCreated: 2790914,
        },
      },
    }),
    [],
  ],
  tangle: [
    defineChain({
      id: 5845,
      name: "Tangle",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
      },
      rpcUrls: {
        default: {
          http: ["https://rpc.tangle.tools"],
        },
      },
      blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.tangle.tools" },
      },
      contracts: {
        multicall3: {
          address: "0xd595D34ed96b253E7c7a934a7624F330a8411953",
          blockCreated: 2790914,
        },
      },
    }),
    [],
  ],
} as const;

export default definitions;