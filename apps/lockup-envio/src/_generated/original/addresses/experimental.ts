export let chainId = 11155111;
export let chain = "sepolia";
export let startBlock_lockup = 4067889;
export let startBlock_merkle = 4904890;
export let startBlock_flow = 6618000;
export let startBlock_merger = 7292400;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xd4300c5bc0b9e27c73ebabdc747ba990b1b570db", "LL", "V20"],
  ["0x7a43f8a888fa15e68c103e18b0439eb1e98e4301", "LL2", "V21"],
  ["0x3e435560fd0a03ddf70694b35b673c25c65abb6c", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x421e1e7a53ff360f70a2d02037ee394fa474e035", "LD", "V20"],
  ["0xc9940ad8f43aad8e8f33a4d5dbbf0a8f7ff4429a", "LD2", "V21"],
  ["0x73bb6dd3f5828d60f8b3dbc8798eb10fba2c5636", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x83dd52fca44e069020b58155b761a590f12b59d3", "FL", "V10"],
  ["0x52ab22e769e31564e17d524b683264b65662a014", "FL2", "V11"],
];

export let tranched: string[][] = [
  ["0x3a1bea13a8c24c0ea2b8fae91e4b2762a59d7af5", "LT3", "V22"],
];

export let merged: string[][] = [
  ["0xc2da366fd67423b500cdf4712bdb41d0995b0794", "LK", "V23"],
];

export let factory: string[][] = [
  ["0xbacc1d151a78eed71d504f701c25e8739dc0262d", "MSF2", "V21"],
  ["0x56e9180a8d2c35c99f2f8a1a5ab8abe79e876e8c", "MSF3", "V22"],
  ["0x4ecd5a688b0365e61c1a764e8bf96a7c5df5d35f", "MSF4", "V23"],
];

/** PRBProxy registry */
export let registry = "0x584009E9eDe26e212182c9745F5c000191296a78";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
