export let chainId = 81457;
export let chain = "blast-mainnet";
export let startBlock_lockup = 243800;
export let startBlock_merkle = 244700;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xcb099efc90e88690e287259410b9ae63e1658cc6", "LL2", "V21"],
  ["0x9b1468d29b4a5869f00c92517c57f8656e928b93", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0xdf578c2c70a86945999c65961417057363530a1c", "LD2", "V21"],
  ["0xa705de617673e2fe63a4ea0e58c26897601d32a5", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0x91fb72e5297e2728c10fde73bde74a4888a68570", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x92fc05e49c27884d554d98a5c01ff0894a9dc29a", "MSF2", "V21"],
  ["0x3abcdda756d069cf3c7a17410602343966eaff27", "MSF3", "V22"],
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
