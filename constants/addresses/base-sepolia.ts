export const chainId = 84532;
export const chain = "base-sepolia";
export const startBlock_lockup = 12641000;
export const startBlock_merkle = 12641000;
export const startBlock_flow = 18780000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [["0xfe7fc0bbde84c239c0ab89111d617dc7cc58049f", "LL3", "V22"]];

export const dynamic: string[][] = [["0x6dcb73e5f7e8e70be20b3b9cf50e3be4625a91c3", "LD3", "V22"]];

export const tranched: string[][] = [["0xb8c724df3ec8f2bf8fa808df2cb5dbab22f3e68c", "LT3", "V22"]];

export const merged: string[][] = [["0xa4777ca525d43a7af55d45b11b430606d7416f8d", "LK", "V23"]];

export const flow: string[][] = [
  ["0xd5f78708d83ac2bc8734a8cdf2d112c1bb3b62a2", "FL", "V10"],
  ["0xfb6b72a5988a7701a9090c56936269241693a9cc", "FL2", "V11"],
];

export const factory: string[][] = [
  ["0x899a05feb160fe912f621733a1d0b39c1446b3eb", "MSF3", "V22"],
  ["0x6a3466398a66c7ce801989b45c390cdc8717102d", "MSF4", "V23"],
];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
