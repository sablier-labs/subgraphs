import { ContractCategory, StreamVersion, chains } from "../constants";
import type { Address, Contract, Event } from "../types";

export async function getContract(
  event: Event,
  address: Address,
  loader: (id: string) => Promise<Contract | undefined>,
) {
  const id = generateContractId(event, address);
  const loaded = await loader(id);

  if (!loaded) {
    throw new Error("Missing contract instance");
  }
  return loaded;
}

export function createContract(
  event: Event,
  address: Address,
  alias: string,
  version: StreamVersion,
  category: ContractCategory,
) {
  const entity: Contract = {
    id: generateContractId(event, address),
    address: address.toLowerCase(),
    chainId: BigInt(event.chainId),
    admin: undefined,
    alias,
    category,
    version,
  };

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateContractId(event: Event, address: Address) {
  return "".concat(address.toLowerCase()).concat("-").concat(event.chainId.toString());
}

export function generateContractIdFromEvent(event: Event) {
  return "".concat(event.srcAddress.toLowerCase()).concat("-").concat(event.chainId.toString());
}

export function _initialize(event: Event): Contract[] {
  const versions = [StreamVersion.V20, StreamVersion.V21, StreamVersion.V22, StreamVersion.V23];

  return chains.flatMap((chain) => {
    return versions.flatMap((version) => {
      const LL = chain[version].linear.map((linear) =>
        createContract(event, linear.address, linear.alias, version, ContractCategory.LockupLinear),
      );

      const LD = chain[version].dynamic.map((dynamic) =>
        createContract(event, dynamic.address, dynamic.alias, version, ContractCategory.LockupDynamic),
      );

      const LT = chain[version].tranched.map((tranched) =>
        createContract(event, tranched.address, tranched.alias, version, ContractCategory.LockupTranched),
      );

      const LK = chain[version].merged.map((merged) =>
        createContract(event, merged.address, merged.alias, version, ContractCategory.LockupMerged),
      );

      return [LL, LD, LT, LK].flat();
    });
  });
}
