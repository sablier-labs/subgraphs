export let chainId = 130;
export let chain = "unichain";
export let startBlock_lockup = 13882000;
export let startBlock_merkle = 13882000;
export let startBlock_flow = 13882000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0x26c341c4d79ba8f6bfb450a49e9165c936316b14", "LK", "V23"],
];

export let flow: string[][] = [
  ["0x9797b40340be0bfc9ec0dbb8712627bcdd17e771", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0xc6fc028e988d158c52aa2e38cdd6f969aa14bdcd", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
