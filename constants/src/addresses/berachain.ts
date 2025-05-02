export const chainId = 80094;
export const chain = "berachain";
export const startBlock_lockup = 770000;
export const startBlock_merkle = 770000;
export const startBlock_flow = 770000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [["0xf2b2cca6b8062996f5b5b7e97e0bc821f1266dbc", "LL2", "V21"]];

export const dynamic: string[][] = [["0x1774629dbac6faad3af535a074f4e8399f4f063b", "LD2", "V21"]];

export const tranched: string[][] = [];

export const merged: string[][] = [["0xc19a2542156b5d7960e0ef46e9787e7d336cf428", "LK", "V23"]];

export const flow: string[][] = [["0xa031544946ed769377128fbd961c9d621c4b4179", "FL2", "V11"]];

export const factory: string[][] = [
  ["0x7868af143cc5e6cd03f9b4f5cdd2832695a85d6b", "MSF4", "V23"], // Make this initializer since this is where the first campaign was created
  ["0x7a34159cf99f0e04596b7c93c96ff390d806e3be", "MSF2", "V21"],
];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
