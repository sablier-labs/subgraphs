export let chainId = 50104;
export let chain = "sophon";
export let startBlock_lockup = 1;
export let startBlock_merkle = 1;
export let startBlock_flow = 1;

export let hypersync = "https://sophon.hypersync.xyz";

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0x6386dA73545ae4E2B2E0393688fA8B65Bb9a7169", "LK", "V23"],
];

export let flow: string[][] = [
  ["0x6386dA73545ae4E2B2E0393688fA8B65Bb9a7169", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0x6386dA73545ae4E2B2E0393688fA8B65Bb9a7169", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
