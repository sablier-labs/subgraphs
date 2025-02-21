export let chainId = 478;
export let chain = "form";
export let startBlock_lockup = 3357800;
export let startBlock_merkle = 3357800;
export let startBlock_flow = 3357800;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [["", "LK", "V23"]];

export let flow: string[][] = [["", "FL2", "V11"]];

export let factory: string[][] = [["", "MSF4", "V23"]];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
