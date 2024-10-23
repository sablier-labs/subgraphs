export let chainId = 4689;
export let chain = "iotex";
export let startBlock_lockup = 31786000;
export let startBlock_merkle = 31787000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x84f092cf4d7d36c2d4987f672df81a39200a7146", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x6fcab41e3b62d05ab4fc729586cb06af2a2662d0", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0x179536f3289fb50076968b339c7ef0dc0b38e3af", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0xf978034bb3cab5fe88d23db5cb38d510485dab90", "MSF3", "V22"],
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
