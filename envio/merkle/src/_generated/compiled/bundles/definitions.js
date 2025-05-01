"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var viem_1 = require("viem");
var chains_1 = require("viem/chains");
var definitions = {
    mainnet: [
        chains_1.mainnet,
        [
            "https://rpc.ankr.com/eth",
            "https://eth.llamarpc.com",
            "https://ethereum.publicnode.com",
            "https://eth-mainnet.public.blastapi.io",
            "https://rpc.tornadoeth.cash/eth",
        ],
    ],
    arbitrum: [
        chains_1.arbitrum,
        [
            "https://arbitrum.llamarpc.com",
            "https://arb-pokt.nodies.app",
            "https://endpoints.omniatech.io/v1/arbitrum/one/public",
            "https://rpc.tornadoeth.cash/arbitrum",
            "https://rpc.ankr.com/arbitrum",
        ],
    ],
    avalanche: [
        chains_1.avalanche,
        [
            "https://avalanche.public-rpc.com",
            "https://avalanche.drpc.org",
            "https://api.avax.network/ext/bc/C/rpc",
            "https://rpc.ankr.com/avalanche",
            "https://avax.meowrpc.com",
        ],
    ],
    base: [
        chains_1.base,
        [
            "https://base.llamarpc.com",
            "https://base-pokt.nodies.app",
            "https://base-mainnet.public.blastapi.io",
            "https://base.drpc.org",
            "https://base.meowrpc.com",
        ],
    ],
    baseSepolia: [
        chains_1.baseSepolia,
        [
            "https://base-sepolia.blockpi.network/v1/rpc/public",
            "https://base-sepolia.gateway.tenderly.co",
            "https://sepolia.base.org",
        ],
    ],
    blast: [
        chains_1.blast,
        [
            "https://rpc.ankr.com/blast",
            "https://blast.din.dev/rpc",
            "https://blastl2-mainnet.public.blastapi.io",
            "https://blast.blockpi.network/v1/rpc/public",
        ],
    ],
    bsc: [
        chains_1.bsc,
        [
            "https://binance.llamarpc.com",
            "https://binance.nodereal.io",
            "https://rpc.ankr.com/bsc",
            "https://rpc.tornadoeth.cash/bsc",
            "https://bsc-mainnet.public.blastapi.io",
        ],
    ],
    chiliz: [
        __assign(__assign({}, chains_1.chiliz), { contracts: {
                multicall3: {
                    address: "0x0E6a1Df694c4be9BFFC4D76f2B936bB1A1df7fAC",
                    blockCreated: 8007643,
                },
            } }),
        ["https://chiliz.publicnode.com", "https://rpc.chiliz.com"],
    ],
    gnosis: [
        chains_1.gnosis,
        [
            "https://rpc.ankr.com/gnosis",
            "https://gnosis-mainnet.public.blastapi.io",
            "https://rpc.gnosischain.com",
            "https://gnosis.drpc.org",
            "https://rpc.tornadoeth.cash/gnosis",
        ],
    ],
    linea: [
        chains_1.linea,
        [
            "https://linea.blockpi.network/v1/rpc/public",
            "https://rpc.linea.build",
            "https://1rpc.io/linea",
        ],
    ],
    optimism: [
        chains_1.optimism,
        [
            "https://optimism.llamarpc.com",
            "https://rpc.ankr.com/optimism",
            "https://optimism.publicnode.com",
            "https://optimism.meowrpc.com",
            "https://rpc.tornadoeth.cash/optimism",
        ],
    ],
    polygon: [
        chains_1.polygon,
        [
            "https://polygon.llamarpc.com",
            "https://polygon-mainnet.public.blastapi.io",
            "https://polygon.drpc.org",
            "https://polygon-rpc.com",
            "https://rpc.ankr.com/polygon",
        ],
    ],
    scroll: [
        chains_1.scroll,
        [
            "https://rpc.ankr.com/scroll",
            "https://rpc-scroll.icecreamswap.com",
            "https://scroll-mainnet.public.blastapi.io",
            "https://rpc.scroll.io",
            "https://scroll-mainnet.chainstacklabs.com",
        ],
    ],
    sepolia: [
        chains_1.sepolia,
        [
            "https://gateway.tenderly.co/public/sepolia",
            "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
            "https://1rpc.io/sepolia",
            "https://gateway.tenderly.co/public/sepolia",
            "https://rpc2.sepolia.org",
        ],
    ],
    zksync: [
        chains_1.zksync,
        [
            "https://mainnet.era.zksync.io",
            "https://1rpc.io/zksync2-era",
            "https://endpoints.omniatech.io/v1/zksync-era/mainnet/public",
        ],
    ],
    mode: [
        chains_1.mode,
        [
            "https://mainnet.mode.network",
            "https://mode.gateway.tenderly.co",
            "https://1rpc.io/mode",
        ],
    ],
    morph: [
        (0, viem_1.defineChain)({
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
        (0, viem_1.defineChain)({
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
    superseed: [
        (0, viem_1.defineChain)({
            id: 5330,
            name: "Superseed",
            nativeCurrency: {
                decimals: 18,
                name: "Ether",
                symbol: "ETH",
            },
            rpcUrls: {
                default: {
                    http: ["https://mainnet.superseed.xyz"],
                    webSocket: ["wss://mainnet.superseed.xyz"],
                },
            },
            blockExplorers: {
                default: {
                    name: "Superseed Explorer",
                    url: "https://explorer.superseed.xyz",
                },
            },
            testnet: false,
            contracts: {
                multicall3: {
                    address: "0x84c4a8984d61ef37ea16c8df8c53ae0cb037d71a",
                    blockCreated: 1108523,
                },
            },
        }),
        [],
    ],
};
exports.default = definitions;
