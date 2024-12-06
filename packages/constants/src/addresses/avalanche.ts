export let chainId = 43114;
export let chain = "avalanche";
export let startBlock_lockup = 32164210;
export let startBlock_merkle = 41023950;
export let startBlock_flow = 53922000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x610346e9088afa70d6b03e96a800b3267e75ca19", "LL", "V20"],
  ["0xb24b65e015620455bb41deaad4e1902f1be9805f", "LL2", "V21"],
  ["0xc0bf14afb95ca4c049bdc19e06a3531d8065f6fd", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x665d1c8337f1035cfbe13dd94bb669110b975f5f", "LD", "V21"],
  ["0x0310da0d8ff141166ed47548f00c96464880781f", "LD2", "V21"],
  ["0xe3826241e5eebb3f5fede33f9f677047674d3fbf", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x8c172e42c06302e3cfe555dc4d6b71a756ee186b", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0xfa536049652bfb5f57ba8dcfbec1b2b2dd9803d3", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0x4849e797d7aab20fcc8f807efafdfff98a83412e", "MSF2", "V21"],
  ["0x0430ed39ea2789acdf27b89268117ebabc8176d1", "MSF3", "V22"],
];

/** PRBProxy registry */
export let registry = "0x584009e9ede26e212182c9745f5c000191296a78";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Lockup] On any new chain, please create a Lockup Linear stream to kick-off indexing
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
