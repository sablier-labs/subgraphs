import * as library from "viem/chains";

/**
 *
 * Fallback RPCs (only public endpoints at the moment)
 * Use Infura/Alchemy in production once ENV vars are enabled on Envio
 *
 */

export const fallbacks: { id: number; rpcEndpoints: string[] }[] = [
  {
    id: library.arbitrum.id,
    rpcEndpoints: [
      ...library.arbitrum.rpcUrls.default.http,
      "https://arbitrum.llamarpc.com",
      "https://arb-pokt.nodies.app",
      "https://endpoints.omniatech.io/v1/arbitrum/one/public",
      "https://rpc.tornadoeth.cash/arbitrum",
      "https://rpc.ankr.com/arbitrum",
    ],
  },
  {
    id: library.avalanche.id,
    rpcEndpoints: [
      ...library.avalanche.rpcUrls.default.http,
      "https://avalanche.public-rpc.com",
      "https://avalanche.drpc.org",
      "https://api.avax.network/ext/bc/C/rpc",
      "https://rpc.ankr.com/avalanche",
      "https://avax.meowrpc.com",
    ],
  },
  {
    id: library.base.id,
    rpcEndpoints: [
      ...library.base.rpcUrls.default.http,
      "https://base.llamarpc.com",
      "https://base-pokt.nodies.app",
      "https://base-mainnet.public.blastapi.io",
      "https://base.drpc.org",
      "https://base.meowrpc.com",
    ],
  },
  {
    id: library.blast.id,
    rpcEndpoints: [
      ...library.blast.rpcUrls.default.http,
      "https://blast.blockpi.network/v1/rpc/public",
    ],
  },
  {
    id: library.bsc.id,
    rpcEndpoints: [
      ...library.bsc.rpcUrls.default.http,
      "https://binance.llamarpc.com",
      "https://binance.nodereal.io",
      "https://rpc.ankr.com/bsc",
      "https://rpc.tornadoeth.cash/bsc",
      "https://bsc-mainnet.public.blastapi.io",
    ],
  },
  {
    id: library.gnosis.id,
    rpcEndpoints: [
      ...library.gnosis.rpcUrls.default.http,
      "https://rpc.ankr.com/gnosis",
      "https://gnosis-mainnet.public.blastapi.io",
      "https://rpc.gnosischain.com",
      "https://gnosis.drpc.org",
      "https://rpc.tornadoeth.cash/gnosis",
    ],
  },
  {
    id: library.linea.id,
    rpcEndpoints: [
      ...library.linea.rpcUrls.default.http,
      "https://linea.blockpi.network/v1/rpc/public",
      "https://rpc.linea.build",
      "https://1rpc.io/linea",
    ],
  },
  {
    id: library.mainnet.id,
    rpcEndpoints: [
      ...library.mainnet.rpcUrls.default.http,
      "https://rpc.ankr.com/eth",
      "https://eth.llamarpc.com",
      "https://ethereum.publicnode.com",
      "https://eth-mainnet.public.blastapi.io",
      "https://rpc.tornadoeth.cash/eth",
    ],
  },
  {
    id: library.optimism.id,
    rpcEndpoints: [
      ...library.optimism.rpcUrls.default.http,
      "https://optimism.llamarpc.com",
      "https://rpc.ankr.com/optimism",
      "https://optimism.publicnode.com",
      "https://optimism.meowrpc.com",
      "https://rpc.tornadoeth.cash/optimism",
    ],
  },
  {
    id: library.polygon.id,
    rpcEndpoints: [
      ...library.polygon.rpcUrls.default.http,
      "https://polygon.llamarpc.com",
      "https://polygon-mainnet.public.blastapi.io",
      "https://polygon.drpc.org",
      "https://polygon-rpc.com",
      "https://rpc.ankr.com/polygon",
    ],
  },
  {
    id: library.scroll.id,
    rpcEndpoints: [
      ...library.scroll.rpcUrls.default.http,
      "https://rpc.ankr.com/scroll",
      "https://rpc-scroll.icecreamswap.com",
      "https://scroll-mainnet.public.blastapi.io",
      "https://rpc.scroll.io",
      "https://scroll-mainnet.chainstacklabs.com",
    ],
  },
  {
    id: library.sepolia.id,
    rpcEndpoints: [
      ...library.sepolia.rpcUrls.default.http,
      "https://gateway.tenderly.co/public/sepolia",
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
      "https://1rpc.io/sepolia",
      "https://gateway.tenderly.co/public/sepolia",
      "https://rpc2.sepolia.org",
    ],
  },
  {
    id: library.zkSync.id,
    rpcEndpoints: [
      ...library.zkSync.rpcUrls.default.http,
      "https://mainnet.era.zksync.io",
      "https://1rpc.io/zksync2-era",
      "https://endpoints.omniatech.io/v1/zksync-era/mainnet/public",
    ],
  },
];
