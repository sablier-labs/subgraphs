export let chainId = 88888;
export let chain = "chiliz";
export let startBlock_lockup = 19125000;
export let startBlock_merkle = 19125000;
export let startBlock_flow = 19125000;

export let hypersync = "https://chiliz.hypersync.xyz";

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xdf578c2c70a86945999c65961417057363530a1c", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0xcff4a803b0bf55dd1be38fb96088478f3d2eecf2", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x9efc8663cab0e2d97ad17c9fbfc8392445517e94", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0xcb099efc90e88690e287259410b9ae63e1658cc6", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x92fc05e49c27884d554d98a5c01ff0894a9dc29a", "MSF3", "V22"],
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