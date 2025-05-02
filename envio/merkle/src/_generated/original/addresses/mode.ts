export const chainId = 34443;
export const chain = "mode-mainnet";
export const startBlock_lockup = 11343000;
export const startBlock_merkle = 11343000;
export const startBlock_flow = 16616000;

export const hypersync = "https://mode.hypersync.xyz";

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [["0xd8c65bd7cb6924ef895b2edca03407c652f5a2c5", "LL3", "V22"]];

export const dynamic: string[][] = [["0x704552099f5ad679294d337638b9a57fd4726f52", "LD3", "V22"]];

export const tranched: string[][] = [["0xbbfa51a10be68714fa33281646b986dae9f52021", "LT3", "V22"]];

export const merged: string[][] = [["0x3aebadfc423fd08be4715986f68d5e9a597ec974", "LK", "V23"]];

export const flow: string[][] = [
  ["0x75970dde488431fc4961494569def3269f20d6b3", "FL", "V10"],
  ["0xc968e8eefe19bd6de8868df40d9740be127a172a", "FL2", "V11"],
];

export const factory: string[][] = [
  ["0x0fd01dd30f96a15de6afad5627d45ef94752460a", "MSF3", "V22"],
  ["0xc472391db89e7be07170f18c4fdb010242507f2c", "MSF4", "V23"],
];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
