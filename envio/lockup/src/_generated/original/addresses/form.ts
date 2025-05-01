export let chainId = 478;
export let chain = "form";
export let startBlock_lockup = 3359280;
export let startBlock_merkle = 3363710;
export let startBlock_flow = 3363700;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [];

export let dynamic: string[][] = [];

export let tranched: string[][] = [];

export let merged: string[][] = [
  ["0xa2dd5e785aa0225d681416884d395c7e22d92850", "LK", "V23"],
];

export let flow: string[][] = [
  ["0x5dd399bb320412df92df5c10484d3f8d481fe231", "FL2", "V11"],
];

export let factory: string[][] = [
  ["0xa9264ef7cb1516cc27fcd5149a2909ace885ffb6", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export let initializer_lockup = merged[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
