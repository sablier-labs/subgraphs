export let chainId = 137;
export let chain = "matic";
export let startBlock_lockup = 44637120;
export let startBlock_merkle = 51245830;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x67422c3e36a908d5c3237e9cffeb40bde7060f6e", "LL", "V20"],
  ["0x5f0e1dea4a635976ef51ec2a2ed41490d1eba003", "LL2", "V21"],
  ["0x8d87c5eddb5644d1a714f85930ca940166e465f0", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x7313addb53f96a4f710d3b91645c62b434190725", "LD", "V20"],
  ["0xb194c7278c627d52e440316b74c5f24fc70c1565", "LD2", "V21"],
  ["0x8d4ddc187a73017a5d7cef733841f55115b13762", "LD3", "V22"],
];

export let tranched: string[][] = [
  ["0xbf67f0a1e847564d0efad475782236d3fa7e9ec2", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0xf4906225e783fb8977410bdbfb960cabed6c2ef4", "MSF2", "V21"],
  ["0xc28872e0c1f3633eed467907123727ac0155029d", "MSF3", "V22"],
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
