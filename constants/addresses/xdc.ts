export const chainId = 50;
export const chain = "xinfin";
export const startBlock_lockup = 85225600;
export const startBlock_merkle = 85226400;
export const startBlock_flow = 85226800;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [];

export const dynamic: string[][] = [];

export const tranched: string[][] = [];

export const merged: string[][] = [["0x489e0dc5e62a751a2b209f1cc03e189fd6257176", "LK", "V23"]];

export const flow: string[][] = [["0xd6482334242862951da3e730f818c3f6e3f45a30", "FL2", "V11"]];

export const factory: string[][] = [["0xe41909f5623c3b78219d9a2bb92be95aee5bbc30", "MSF4", "V23"]];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = merged[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
