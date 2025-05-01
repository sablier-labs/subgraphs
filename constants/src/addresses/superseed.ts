export let chainId = 5330;
export let chain = "superseed";
export let startBlock_lockup = 2896100;
export let startBlock_merkle = 2896400;
export let startBlock_flow = 3610000;

export let hypersync = "https://extrabud.hypersync.xyz";

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x251fc799344151026d19b959b8f3667416d56b88", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x1fa500262b352d821b4e1c933a20f2242b45383d", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0x91211e1760280d3f7df2182ce4d1fd6a1735c202", "LT3", "V22"],
];

export let merged: string[][] = [
  ["0xf46d1f8c85f215a515f6d738ab3e3ba081f6c083", "LK", "V23"],
];

export let flow: string[][] = [
  ["0x4f5f9b3fb57bba43aaf90e3f71d8f8f384e88e20", "FL", "V10"],
  ["0x40e75bb2f2aa3507d3a332872829c71be19ef623", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0xf60beadefbeb98c927e13c4165bca7d85ba32cb2", "MSF3", "V22"],
  ["0x3df48bb93509d9a041c81f6670c37b1eeb3e154b", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
