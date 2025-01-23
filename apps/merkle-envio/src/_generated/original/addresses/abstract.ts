export let chainId = 2741;
export let chain = "abstract";
export let startBlock_lockup = 72000;
export let startBlock_merkle = 73000;
export let startBlock_flow = 73000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x7282d83e49363f373102d195f66649ebd6c57b9b", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0xc69c06c030e825ede13f1486078aa9a2e2aaffaf", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x001f1408515ccd5c1a19a682455ed4efa39dadd6", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0x28fcae6bda2546c93183eec8638691b2eb184003", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0xe2c0c3e0ff10df4485a2dcbbdd1d002a40446164", "MSF3", "V22"],
];

export let merged: string[][] = [];

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
