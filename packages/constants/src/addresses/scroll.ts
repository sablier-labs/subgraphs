export let chainId = 534352;
export let chain = "scroll";
export let startBlock_lockup = 284000;
export let startBlock_merkle = 1675330;
export let startBlock_flow = 11643000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x80640ca758615ee83801ec43452feea09a202d33", "LL", "V20"],
  ["0x57e14ab4dad920548899d86b54ad47ea27f00987", "LL2", "V21"],
  ["0xbc5dc6d77612e636da32af0d85ca3179a57330fd", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0xde6a30d851efd0fc2a9c922f294801cfd5fcb3a1", "LD", "V20"],
  ["0xaaff2d11f9e7cd2a9cdc674931fac0358a165995", "LD2", "V21"],
  ["0xac199bfea92aa4d4c3d8a49fd463ead99c7a6a8f", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x66826f53bffeaab71adc7fe1a77e86f8268848d8", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0xb0f78ddc01d829d8b567821eb193de8082b57d9d", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0xb3ade5463000e6c0d376e7d7570f372ebf98bdaf", "MSF2", "V21"],
  ["0x344afe8ad5dba3d55870dc398e0f53b635b2ed0d", "MSF3", "V22"],
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
