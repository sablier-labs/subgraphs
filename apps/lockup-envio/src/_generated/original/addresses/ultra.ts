export let chainId = 19991;
export let chain = "mainnet";
export let startBlock_lockup = 4858700;
export let startBlock_merkle = 4858600;
export let startBlock_flow = 4858900;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0x4749db4834be9b473d586ad4d98133dafc678313", "LK", "V23"],
];

export let flow: string[][] = [
  ["0xaf210dd54870745ed18f1081252aeee4119ea6ca", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0x5e73bb96493c10919204045fcdb639d35ad859f8", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
