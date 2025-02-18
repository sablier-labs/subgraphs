export let chainId = 80094;
export let chain = "berachain";
export let startBlock_lockup = 770000;
export let startBlock_merkle = 770000;
export let startBlock_flow = 770000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xf2b2cca6b8062996f5b5b7e97e0bc821f1266dbc", "LL2", "V21"],
];

export let dynamic: string[][] = [
  ["0x1774629dbac6faad3af535a074f4e8399f4f063b", "LD2", "V21"],
];

export let flow: string[][] = [
  ["0xa031544946ed769377128fbd961c9d621c4b4179", "FL2", "V11"],
];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0xc19a2542156b5d7960e0ef46e9787e7d336cf428", "LK", "V23"],
];

export let factory: string[][] = [
  ["0x7a34159cf99f0e04596b7c93c96ff390d806e3be", "MSF2", "V21"],
  ["0x7868af143cc5e6cd03f9b4f5cdd2832695a85d6b", "MSF4", "V23"],
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
