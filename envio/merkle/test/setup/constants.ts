export type Vendor = "Envio" | "TheGraph";
export const CHAIN_ETHEREUM_ID = 1;
export const CHAIN_SEPOLIA_ID = 11155111;

export const ENVIO_ID = "508d217"; //"1b9e211";

export const _configurations = (
  REMOTE: boolean,
): Record<
  number,
  {
    endpoint: Record<Vendor, string>;
    admin: string;
    asset: string;
    airdropIds: string[];
  }
> => ({
  [CHAIN_SEPOLIA_ID]: {
    endpoint: {
      Envio: REMOTE ? `https://indexer.hyperindex.xyz/${ENVIO_ID}/v1/graphql` : "http://localhost:8080/v1/graphql",
      TheGraph: "https://api.studio.thegraph.com/query/57079/sablier-airdrops-experimental/version/latest",
    },
    admin: "0xf31b00e025584486f7c37cf0ae0073c97c12c634",
    asset: "0x776b6fc2ed15d6bb5fc32e0c89de68683118c62a",
    airdropIds: [
      "0x8ca71b0f22d74a0a2ec2d176a30b4c6a07c6587c-11155111",
      "0x8ca71b0f22d74a0a2ec2d176a30b4c6a07c6587c-11155111",
      "0xc65a07656d99766998ea3f32b242a51ed06079f4-11155111",
      "0x2c86ca0c8b1d7c02d6a686eb1217987de13d73ec-11155111",
      "0x457ea894243ded4b36f529921e3516f26630be32-11155111",
    ],
  },
  [CHAIN_ETHEREUM_ID]: {
    endpoint: {
      Envio: REMOTE ? `https://indexer.hyperindex.xyz/${ENVIO_ID}/v1/graphql` : "http://localhost:8080/v1/graphql",
      TheGraph: "https://api.studio.thegraph.com/query/57079/sablier-v2-ms/version/latest",
    },
    admin: "0x8cc40bc56f32769858061bf8b26f3dd07486e170",
    asset: "0x3bd7d4f524d09f4e331577247a048d56e4b67a7f",
    airdropIds: [
      "0x70e3e243909e9bc9027ff160c6ec5ab5ee4b951e-1",
      "0x507c45db6ecf98d0ccb3c93fb945f018eb1145b7-1",
      "0xd2e4d6e1a7e5b464e7332c1a0a58d65f3579e955-1",
      "0x1af1d9d454499785a4aa64f6adf677f39c26b75e-1",
      "0x8c533e08886684039c196d077d67bfd64cd16d65-1",
      "0xac48cfe22c21d85b488dfbfbc4e94279b7c84a37-1",
      "0x84b3b8fa483e7f5a57e3beb1c6d3996c67e3d25c-1",
    ],
  },
});

/** SPECIALIZED CONFIGURATION */

export const REMOTE = true;
export const SKIP_CLEANUP = false;

export const chainId = CHAIN_SEPOLIA_ID;
export const configurations = _configurations(REMOTE);
export const endpoint = configurations[chainId].endpoint;
export const configuration = configurations[chainId];
