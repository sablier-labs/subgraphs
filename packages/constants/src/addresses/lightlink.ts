export let chainId = 1890;
export let chain = "mainnet";
export let startBlock_lockup = 63524900;
export let startBlock_merkle = 63526300;
export let startBlock_flow = 116397000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export let linear: string[][] = [
  ["0x17c4f98c40e69a6A0D5c42B11E3733f076A99E20", "LL2", "V21"],
  ["0x6329591464fa6721c8e1c1271e4c6c41531aea6b", "LL3", "V22"],
];

export let dynamic: string[][] = [
  ["0x49d753422ff05daa291A9efa383E4f57daEAd889", "LD2", "V21"],
  ["0xaa05e418fb7851c211351c65435f1b17cbfa88bf", "LD3", "V22"],
];

export let flow: string[][] = [
  ["0x46fa0164c5af9382d330e5a245a2ca8a18398950", "FL", "V10"],
];

export let tranched: string[][] = [
  ["0x83403c6426e6d044bf3b84ec1c007db211aaa140", "LT3", "V22"],
];

export let factory: string[][] = [
  ["0xdB07a1749D5Ca49909C7C4159652Fbd527c735B8", "MSF2", "V21"],
  ["0x278ac15622846806bd46fbdbdb8db8d09614173a", "MSF3", "V22"],
];

/** PRBProxy registry */
export let registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 * It should be a linear contract, the oldest/first one deployed on this chain.
 * ↪ 🚨 [Lockup] On any new chain, please create a Lockup Linear stream to kick-off indexing
 */

export let initializer_lockup = linear[0][0];
export let initializer_merkle = factory[0][0];
export let initializer_flow = flow[0][0];
