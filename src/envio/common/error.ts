import type { Indexed } from "../../types";

export namespace IndexingError {
  export class AliasNotFound extends Error {
    constructor(protocol: Indexed.Protocol, chainId: number, contractAddress: string) {
      super(
        `Contract alias not available for contract: ${contractAddress}, protocol: ${protocol}, chain ID ${chainId}`,
      );
      this.name = "ContractAliasNotFoundError";
    }
  }

  export class ContractNotFound extends Error {
    constructor(protocol: Indexed.Protocol, chainId: number, contractAddress: string) {
      super(`Contract not found for address: ${contractAddress}, protocol: ${protocol}, chain ID ${chainId}`);
      this.name = "ContractNotFoundError";
    }
  }

  export class ClientNotFound extends Error {
    constructor(chainId: number) {
      super(`No client found for chain with ID ${chainId}`);
      this.name = "ClientNotFoundError";
    }
  }
}
