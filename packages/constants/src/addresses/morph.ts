export let chainId = 2818;
export let chain = "morph";
export let startBlock_lockup = 45000;
export let startBlock_merkle = 45000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xac19f4181e58efb7094e0cb4e1bb18c79f6aadf4", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x946654ab30dd6ed10236c89f2c8b2719df653691", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0x63b92f7e2f69877184c955e63b9d8dff55e52e14", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x5e73bb96493c10919204045fcdb639d35ad859f8", "MSF3", "V22"],
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
