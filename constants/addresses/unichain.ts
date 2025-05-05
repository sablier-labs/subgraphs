export const chainId = 130;
export const chain = "unichain";
export const startBlock_lockup = 13882000;
export const startBlock_merkle = 13882000;
export const startBlock_flow = 13882000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [];

export const dynamic: string[][] = [];

export const tranched: string[][] = [];

export const merged: string[][] = [["0x26c341c4d79ba8f6bfb450a49e9165c936316b14", "LK", "V23"]];

export const flow: string[][] = [["0x9797b40340be0bfc9ec0dbb8712627bcdd17e771", "FL2", "V11"]];

export const factory: string[][] = [["0xc6fc028e988d158c52aa2e38cdd6f969aa14bdcd", "MSF4", "V23"]];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = merged[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
