export const chainId = 8453;
export const chain = "base";
export const startBlock_lockup = 1750270;
export const startBlock_merkle = 8026890;
export const startBlock_flow = 23269000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [
  ["0x6b9a46c8377f21517e65fa3899b3a9fab19d17f5", "LL", "V20"],
  ["0xfcf737582d167c7d20a336532eb8bcca8cf8e350", "LL2", "V21"],
  ["0x4cb16d4153123a74bc724d161050959754f378d8", "LL3", "V22"],
];

export const dynamic: string[][] = [
  ["0x645b00960dc352e699f89a81fc845c0c645231cf", "LD", "V20"],
  ["0x461e13056a3a3265cef4c593f01b2e960755de91", "LD2", "V21"],
  ["0xf9e9ed67dd2fab3b3ca024a2d66fcf0764d36742", "LD3", "V22"],
];
export const tranched: string[][] = [["0xf4937657ed8b3f3cb379eed47b8818ee947beb1e", "LT3", "V22"]];
export const merged: string[][] = [["0xb5d78dd3276325f5faf3106cc4acc56e28e0fe3b", "LK", "V23"]];

export const flow: string[][] = [
  ["0x1a9adc0e2114c8407cc31669baafeee031d15dd2", "FL", "V10"],
  ["0x6fe93c7f6cd1dc394e71591e3c42715be7180a6a", "FL2", "V11"],
];

export const factory: string[][] = [
  ["0x5545c8e7c3e1f74adc98e518f2e8d23a002c4412", "MSF2", "V21"],
  ["0x58a51e5382318eea6065bb7721eecdf4331c0b90", "MSF3", "V22"],
  ["0xd9e108f26fe104ce1058d48070438dedb3ad826a", "MSF4", "V23"],
];

/** PRBProxy registry */
export const registry = "0x584009e9ede26e212182c9745f5c000191296a78";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
