export let chainId = 300;
export let chain = "zksync-era-sepolia";
export let startBlock_lockup = 3240000;
export let startBlock_merkle = 3250000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x43864c567b89fa5fee8010f92d4473bf19169bba", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0xc4311a5913953162111bf75530f7bb14ec24e014", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0xf6e869b73e20b812dcf0e850aa8822f74f67f670", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x2cef8c06ddf7a1440ad2561c53821e43addbfa31", "MSF3", "V22"],
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
