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
        "https://api.studio.thegraph.com/query/112500/sablier-flow-sepolia/version/latest",
    },
    token: "0x776b6fc2ed15d6bb5fc32e0c89de68683118c62a",
    recipient: "0xf31b00e025584486f7c37cf0ae0073c97c12c634",
    sender: "0xf31b00e025584486f7c37cf0ae0073c97c12c634",
    streamIds: [
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-4",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-5",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-6",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-7",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-8",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-9",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-10",
      "0x93fe8f86e881a23e5a2feb4b160514fd332576a6-11155111-11",
    ],
  },
});

/** SPECIALIZED CONFIGURATION */

export const REMOTE = true;
export const SKIP_CLEANUP = false;
export const POWER_SKIP_SUBGRAPH_ID_ASC = 0;

export const chainId = CHAIN_SEPOLIA_ID;
export const configurations = _configurations(REMOTE);
export const endpoint = configurations[chainId].endpoint;
export const configuration = configurations[chainId];
