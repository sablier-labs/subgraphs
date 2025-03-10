export let chainId = 4689;
export let chain = "iotex";
export let startBlock_lockup = 31786000;
export let startBlock_merkle = 31787000;
export let startBlock_flow = 33533000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x84f092cf4d7d36c2d4987f672df81a39200a7146", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x6fcab41e3b62d05ab4fc729586cb06af2a2662d0", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0x179536f3289fb50076968b339c7ef0dc0b38e3af", "LT3", "V22"],
];

export let merged: string[][] = [
  ["0xcaf51434a0af3c43cd5569bc5ecc5aa21d28086e", "LK", "V23"],
];

export let flow: string[][] = [
  ["0x1ddc1c21cd39c2fa16366e6036c95342a31831ba", "FL", "V10"],
  ["0xcd8871a22640c57ba36984fb57e9c794f5df7f40", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0xf978034bb3cab5fe88d23db5cb38d510485dab90", "MSF3", "V22"],
  ["0xf08548b1a6db590fec6f1b95e6b41d17791767c2", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
