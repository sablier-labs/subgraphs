import type { Sablier } from "@sablier/deployments";
import { getChainName } from "@src/chains";
import type { IndexedProtocol } from "@src/types";
import { formatRelease, logAndThrow } from "./helpers";

export const definitions = {
  aliasNotFound: (release: Sablier.Release, chainId: number, contract: Sablier.Contract): never => {
    const chainName = getChainName(chainId);
    const msg = `Alias not found for contract ${contract.name} in ${formatRelease(release)} on ${chainName}`;
    logAndThrow(msg);
  },
  blockNotFound: (release: Sablier.Release, chainId: number, contract: Sablier.Contract): never => {
    const chainName = getChainName(chainId);
    const msg = `Start block not found for contract ${contract.name} in ${formatRelease(release)} on ${chainName}`;
    logAndThrow(msg);
  },
  contractsNotFound: (protocol: IndexedProtocol, chainId: number): never => {
    const chainName = getChainName(chainId);
    const msg = `No contracts found for ${protocol} on ${chainName}`;
    logAndThrow(msg);
  },
  releaseNotFound: (protocol: IndexedProtocol, version: Sablier.Version): never => {
    const msg = `Sablier release not found for ${protocol} ${version}`;
    logAndThrow(msg);
  },
};

interface Thrower {
  aliasNotFound: typeof definitions.aliasNotFound;
  blockNotFound: typeof definitions.blockNotFound;
  contractsNotFound: typeof definitions.contractsNotFound;
  releaseNotFound: typeof definitions.releaseNotFound;
}

/**
 * The types have to be defined like this because of TypeScript's strange type inference for `never`.
 * @see https://stackoverflow.com/q/79621414/3873510
 */
export const thrower: Thrower = {
  aliasNotFound: definitions.aliasNotFound,
  blockNotFound: definitions.blockNotFound,
  contractsNotFound: definitions.contractsNotFound,
  releaseNotFound: definitions.releaseNotFound,
};

export default thrower;
