import type { Sablier } from "@sablier/deployments";
import { getGraphChainName } from "@src/chains";
import { formatRelease } from "./helpers";

const messages = {
  contractNotFound: (release: Sablier.Release, chainId: number, contractName: string) => {
    return `Contract ${contractName} not found for ${formatRelease(release)} on ${getGraphChainName(chainId)}`;
  },
};

export default messages;
