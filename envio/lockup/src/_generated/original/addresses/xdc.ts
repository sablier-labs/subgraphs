export let chainId = 50;
export let chain = "xinfin";
export let startBlock_lockup = 85225600;
export let startBlock_merkle = 85226400;
export let startBlock_flow = 85226800;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0x489e0dc5e62a751a2b209f1cc03e189fd6257176", "LK", "V23"],
];

export let flow: string[][] = [
  ["0xd6482334242862951da3e730f818c3f6e3f45a30", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0xe41909f5623c3b78219d9a2bb92be95aee5bbc30", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
