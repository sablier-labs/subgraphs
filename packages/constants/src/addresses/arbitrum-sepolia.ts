export let chainId = 421613;
export let chain = "arbitrum-sepolia";
export let startBlock_lockup = 2838600;
export let startBlock_merkle = 2972050;
export let startBlock_flow = 103460000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0xa3e36b51b7a456812c92253780f4b15bad56e34c", "LL", "V20"],
  ["0x483bdd560de53dc20f72dc66acdb622c5075de34", "LL2", "V21"],
  ["0x9d1c257d9bc09e6e6b8e7e7c2496c12000f55457", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x7938c18a59fad2ba11426acfbe8d74f0f598a4d2", "LD", "V20"],
  ["0x8c8102b92b1f31cc304a085d490796f4dfdf7af3", "LD2", "V21"],
  ["0x8127e8081c22807c8a786af1e1b174939577144a", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x781b3b2527f2a0a1e6b429161f2717a8a28b9f46", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0xaff2effcf38ea4a92e0cc5d7c48456c53358fe1a", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0xcc87b1a4de285832f226bd585bd54a2184d32105", "MSF2", "V21"],
  ["0xa11561f9e418f2c431b411e1ca22fd3f85d4c831", "MSF3", "V22"],
];

/** PRBProxy registry */
export let registry = "0x584009E9eDe26e212182c9745F5c000191296a78";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Lockup] On any new chain, please create a Lockup Linear stream to kick-off indexing
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
