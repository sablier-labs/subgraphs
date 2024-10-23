export let chainId = 59144;
export let chain = "linea";
export let startBlock_lockup = 7728000;
export let startBlock_merkle = 7728000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xb5d39049510f47ee7f74c528105d225e42747d63", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0xf2e46b249cfe09c2b3a2022dc81e0bb4be3336f1", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0xc46ce4b77cbc46d17a2eceb2cc8e2ee23d96529f", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x35e9c3445a039b258eb7112a5eea259a825e8ac0", "MSF3", "V22"],
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
