import { ChainId } from "@sablier/deployments/dist/chains/ids";

const startBlocks: Record<number, Record<string, number>> = {
  [ChainId.ARBITRUM_ONE]: {
    flow: 281_305_000,
    lockup: 107_509_950,
    merkle: 161_026_550,
  },
};

export default startBlocks;
