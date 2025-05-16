import type { Sablier } from "@sablier/deployments";
import { getChainName } from "@src/chains";
import { formatRelease } from "./helpers";

const messages = {
  contractNotFound: (release: Sablier.Release, chainId: number, contractName: string) => {
    return `Contract ${contractName} not found for ${formatRelease(release)} on ${getChainName(chainId)}`;
  },
};

export default messages;
