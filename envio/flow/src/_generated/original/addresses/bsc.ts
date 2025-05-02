export const chainId = 56;
export const chain = "bsc";
export const startBlock_lockup = 29646270;
export const startBlock_merkle = 34438430;
export const startBlock_flow = 44582000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [
  ["0x3fe4333f62a75c2a85c8211c6aefd1b9bfde6e51", "LL", "V20"],
  ["0x14c35e126d75234a90c9fb185bf8ad3edb6a90d2", "LL2", "V21"],
  ["0x88ad3b5c62a46df953a5d428d33d70408f53c408", "LL3", "V22"],
];

export const dynamic: string[][] = [
  ["0xf2f3fef2454dca59eca929d2d8cd2a8669cc6214", "LD", "V20"],
  ["0xf900c5e3aa95b59cc976e6bc9c0998618729a5fa", "LD2", "V21"],
  ["0xeb6d84c585bf8aea34f05a096d6faa3b8477d146", "LD3", "V22"],
];

export const tranched: string[][] = [["0xab5f007b33edda56962a0fc428b15d544ea46591", "LT3", "V22"]];

export const merged: string[][] = [["0x6e0bad2c077d699841f1929b45bfb93fafbed395", "LK", "V23"]];

export const flow: string[][] = [
  ["0xfce01f79247cf450062545e7155d7bd568551d0e", "FL", "V10"],
  ["0x4c4610af3f3861ec99b6f6f8066c03e4c3a0e023", "FL2", "V11"],
];

export const factory: string[][] = [
  ["0x434d73465aac4125d204a6637eb6c579d8d69f48", "MSF2", "V21"],
  ["0x96aa12809cac29bba4944feca1dfdc8e1704e6c1", "MSF3", "V22"],
  ["0xf9f89d99fb702b06fba16a294b7614089defe068", "MSF4", "V23"],
];

/** PRBProxy registry */
export const registry = "0x584009e9ede26e212182c9745f5c000191296a78";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
