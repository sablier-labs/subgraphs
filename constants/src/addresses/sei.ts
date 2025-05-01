export let chainId = 1329;
export let chain = "sei-mainnet";
export let startBlock_lockup = 138913900;
export let startBlock_merkle = 138911900;
export let startBlock_flow = 138911900;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0x736a6e895790e089aec2bf76b2d7f368ce6efff5", "LK", "V23"],
];

export let flow: string[][] = [
  ["0xdef70082ebda4944a55311624900e42a720b4ec9", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0x0171a06878f7ff81c9955deb5641f64f520d45e5", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
