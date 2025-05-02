export const chainId = 19991;
export const chain = "mainnet";
export const startBlock_lockup = 4858700;
export const startBlock_merkle = 4858600;
export const startBlock_flow = 4858900;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [];

export const dynamic: string[][] = [];

export const tranched: string[][] = [];

export const merged: string[][] = [["0x4749db4834be9b473d586ad4d98133dafc678313", "LK", "V23"]];

export const flow: string[][] = [["0xaf210dd54870745ed18f1081252aeee4119ea6ca", "FL2", "V11"]];

export const factory: string[][] = [["0x5e73bb96493c10919204045fcdb639d35ad859f8", "MSF4", "V23"]];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = merged[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
