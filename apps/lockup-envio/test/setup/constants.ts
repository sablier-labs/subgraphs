/** GENERAL CONFIGURATION */

export type Vendor = "Envio" | "TheGraph";

export const CHAIN_ETHEREUM_ID = 1;
export const CHAIN_SEPOLIA_ID = 11155111;
export const CHAIN_OPTIMISM_ID = 10;

export const ENVIO_ID = "53b7e25"; // "d9c1edf";

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
        "https://api.studio.thegraph.com/query/57079/sablier-lockup-experimental/version/latest",
    },
    token: "0x776b6fc2ed15d6bb5fc32e0c89de68683118c62a",
    recipient: "0xf31b00e025584486f7c37cf0ae0073c97c12c634",
    sender: "0xf976aF93B0A5A9F55A7f285a3B5355B8575Eb5bc",
    streamIds: [
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-608",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-609",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-610",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-611",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-612",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-613",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-614",
      "0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a-11155111-70",
    ],
  },
  [CHAIN_ETHEREUM_ID]: {
    endpoint: {
      Envio: REMOTE
        ? `https://indexer.hyperindex.xyz/${ENVIO_ID}/v1/graphql`
        : "http://localhost:8080/v1/graphql",
      TheGraph:
        "https://api.studio.thegraph.com/query/57079/sablier-v2/version/latest/",
    },
    token: "0x3bd7d4f524d09f4e331577247a048d56e4b67a7f",
    recipient: "0x0ed07480ce890937bdd6c9ea442a1a88d78727d5",
    sender: "0x8cc40bc56f32769858061bf8b26f3dd07486e170",
    streamIds: [
      "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9-1-14090",
      "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9-1-10778",
      "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9-1-10776",
      "0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9-1-10469",
    ],
  },
  [CHAIN_OPTIMISM_ID]: {
    endpoint: {
      Envio: REMOTE
        ? `https://indexer.hyperindex.xyz/${ENVIO_ID}/v1/graphql`
        : "http://localhost:8080/v1/graphql",
      TheGraph:
        "https://api.studio.thegraph.com/query/57079/sablier-v2-optimism/version/latest",
    },
    token: "0x1e925de1c68ef83bd98ee3e130ef14a50309c01b",
    recipient: "0xf748879edbe8cca140940788163d7be4d2a2e46a",
    sender: "0xbea586A167853ADddEF12818f264f1F9823fBc18",
    streamIds: [
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3190",
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3178",
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3160",
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3157",
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3137",
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3116",
      "0xb923abdca17aed90eb5ec5e407bd37164f632bfd-10-3110",
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
