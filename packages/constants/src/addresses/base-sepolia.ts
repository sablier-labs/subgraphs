export let chainId = 84532;
export let chain = "base-sepolia";
export let startBlock_lockup = 12641000;
export let startBlock_merkle = 12641000;
export let startBlock_flow = 18780000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xfe7fc0bbde84c239c0ab89111d617dc7cc58049f", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x6dcb73e5f7e8e70be20b3b9cf50e3be4625a91c3", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0xd5f78708d83ac2bc8734a8cdf2d112c1bb3b62a2", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0xb8c724df3ec8f2bf8fa808df2cb5dbab22f3e68c", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x899a05feb160fe912f621733a1d0b39c1446b3eb", "MSF3", "V22"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Lockup] On any new chain, please create a Lockup Linear stream to kick-off indexing
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
