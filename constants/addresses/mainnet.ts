export const chainId = 1;
export const chain = "mainnet";
export const startBlock_lockup = 17613130;
export const startBlock_merkle = 17615650;
export const startBlock_flow = 21330000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [
  ["0xb10daee1fcf62243ae27776d7a92d39dc8740f95", "LL", "V20"],
  ["0xafb979d9afad1ad27c5eff4e27226e3ab9e5dcc9", "LL2", "V21"],
  ["0x3962f6585946823440d274ad7c719b02b49de51e", "LL3", "V22"],
];

export const dynamic: string[][] = [
  ["0x39efdc3dbb57b2388ccc4bb40ac4cb1226bc9e44", "LD", "V20"],
  ["0x7cc7e125d83a581ff438608490cc0f7bdff79127", "LD2", "V21"],
  ["0x9deabf7815b42bf4e9a03eec35a486ff74ee7459", "LD3", "V22"],
];

export const tranched: string[][] = [["0xf86b359035208e4529686a1825f2d5bee38c28a8", "LT3", "V22"]];

export const merged: string[][] = [["0x7c01aa3783577e15fd7e272443d44b92d5b21056", "LK", "V23"]];

export const flow: string[][] = [
  ["0x2d9221a63e12aa796619cb381ec4a71b201281f5", "FL", "V10"],
  ["0x3df2aaede81d2f6b261f79047517713b8e844e04", "FL2", "V11"],
];

export const factory: string[][] = [
  ["0x1a272b596b10f02931480bc7a3617db4a8d154e3", "MSF2", "V21"],
  ["0xf35ab407cf28012ba57caf5ee2f6d6e4420253bc", "MSF3", "V22"],
  ["0x71dd3ca88e7564416e5c2e350090c12bf8f6144a", "MSF4", "V23"],
];

/** PRBProxy registry */
export const registry = "0x584009e9ede26e212182c9745f5c000191296a78";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
