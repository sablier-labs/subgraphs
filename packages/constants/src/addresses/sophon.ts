export let chainId = 50104;
export let chain = "sophon";
export let startBlock_lockup = 11275700;
export let startBlock_merkle = 11290000;
export let startBlock_flow = 11341390;

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
  ["0x28fcae6bda2546c93183eec8638691b2eb184003", "LK", "V23"],
];

export let flow: string[][] = [
  ["0x20c9a3e27322fc2b21ced430d1b2e12d90804db6", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0x9d4923e2ff0b9dadc447a89f528760928f84d0f7", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
