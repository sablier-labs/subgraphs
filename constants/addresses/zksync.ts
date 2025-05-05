export const chainId = 324;
export const chain = "zksync-era";
export const startBlock_lockup = 32472500;
export const startBlock_merkle = 33148900;
export const startBlock_flow = 50572000;

/** Rule: keep addresses lowercased */

/**
 * Keep aliases unique and always in sync with the frontend
 * @example export let linear = [[address1, alias1, version1], [address2, alias2, version2]]
 */

export const linear: string[][] = [
  ["0x2fca69fa0a318efdf4c15ee8f13a873347a8a8d4", "LL2", "V21"],
  ["0x8cb69b514e97a904743922e1adf3d1627deeee8d", "LL3", "V22"],
];

export const dynamic: string[][] = [
  ["0xe6c7324bea8474209103e407779eec600c07cf3f", "LD2", "V21"],
  ["0xf03f4bf48b108360baf1597fb8053ebe0f5245da", "LD3", "V22"],
];

export const tranched: string[][] = [["0x1fb145a47eb9b8bf565273e137356376197b3559", "LT3", "V22"]];

export const merged: string[][] = [["0x7bccb3595aa81dbe8a69dd8c46f5c2a3cf76594a", "LK", "V23"]];

export const flow: string[][] = [
  ["0x015899a075b7c181e357cd0ed000683dbb4f1fce", "FL", "V10"],
  ["0xe3747379bf7282e0ab5389a63ea053a5256042df", "FL2", "V11"],
];

export const factory: string[][] = [
  ["0x46de683d20c3575a0381ffd66c10ab6836390140", "MSF2", "V21"],
  ["0x8a84fcf962163a7e98bf0dafd918973c846fa5c8", "MSF3", "V22"],
  ["0x8e7e78799f8cc87d4816112a758281dabc158452", "MSF4", "V23"],
];

/** PRBProxy registry */
export const registry = "";

/**
 * The initializer contract is used to trigger the indexing of all other contracts.
 */

export const initializer_lockup = linear[0][0];
export const initializer_merkle = factory[0][0];
export const initializer_flow = flow[0][0];
