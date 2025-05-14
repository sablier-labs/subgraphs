/** GENERAL CONFIGURATION */

export type Vendor = "Envio" | "TheGraph";

export const CHAIN_SEPOLIA_ID = 11155111;

export const ENVIO_ID = "3b4ea6b"; // "d9c1edf";

export const _configurations = (
  REMOTE: boolean,
): Record<
  number,
  {
    endpoint: Record<Vendor, string>;
    token: string;
    recipient: string;
    sender: string;
    streamIds: string[];
  }
> => ({
  [CHAIN_SEPOLIA_ID]: {
    endpoint: {
      Envio: REMOTE
        ? `https://indexer.hyperindex.xyz/${ENVIO_ID}/v1/graphql`
        : "http://localhost:8080/v1/graphql",
      TheGraph:
        "https://api.studio.thegraph.com/query/57079/sablier-flow-sepolia/version/latest",
    },
    token: "0x776b6fc2ed15d6bb5fc32e0c89de68683118c62a",
    recipient: "0x8468cD99Cea5EB7279Adf189fAe632FFb06b2F6F",
    sender: "0xf31b00e025584486f7c37cf0ae0073c97c12c634",
    streamIds: [
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-4",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-5",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-6",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-7",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-8",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-9",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-10",
      "0x83dd52fca44e069020b58155b761a590f12b59d3-11155111-11",
    ],
  },
});

/** SPECIALIZED CONFIGURATION */

export const REMOTE = false;
export const SKIP_CLEANUP = false;
export const POWER_SKIP_SUBGRAPH_ID_ASC = 0;

export const chainId = CHAIN_SEPOLIA_ID;
export const configurations = _configurations(REMOTE);
export const endpoint = configurations[chainId].endpoint;
export const configuration = configurations[chainId];
