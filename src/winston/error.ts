import type { Sablier } from "@sablier/deployments";
import { queries } from "@sablier/deployments";
import type { Indexed } from "@src/types";
import { formatRelease, logAndThrow } from "./helpers";

export namespace WinstonError {
  export class AliasNotFound extends Error {
    constructor(release: Sablier.Release, chainId: number, contractName: string) {
      const chainName = queries.chains.getName(chainId) ?? "chain";
      const message = `Alias not found for contract ${contractName} in ${formatRelease(release)} on ${chainName}`;
      super(message);
      this.name = "AliasNotFoundError";
      logAndThrow(message);
    }
  }

  export class BlockNotFound extends Error {
    constructor(release: Sablier.Release, chainId: number, contractName: string) {
      const chainName = queries.chains.getName(chainId) ?? "chain";
      const message = `Start block not found for contract ${contractName} in ${formatRelease(release)} on ${chainName}`;
      super(message);
      this.name = "BlockNotFoundError";
      logAndThrow(message);
    }
  }

  export class ChainNotFound extends Error {
    constructor(chainId: number) {
      const message = `Chain with ID ${chainId} not found`;
      super(message);
      this.name = "ChainNotFound";
      logAndThrow(message);
    }
  }
  export class ContractsNotFound extends Error {
    constructor(protocol: Indexed.Protocol, chainId: number) {
      const chainName = queries.chains.getName(chainId) ?? "chain";
      const message = `No contracts found for ${protocol} on ${chainName}`;
      super(message);
      this.name = "ContractsNotFoundError";
      logAndThrow(message);
    }
  }

  export class ReleaseNotFound extends Error {
    constructor(protocol: Indexed.Protocol, version: Indexed.Version) {
      const message = `Sablier release not found for ${protocol} ${version}`;
      super(message);
      this.name = "ReleaseNotFoundError";
      logAndThrow(message);
    }
  }
}
