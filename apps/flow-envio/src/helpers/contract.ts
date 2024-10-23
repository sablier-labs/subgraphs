import type { Address, Contract, Event } from "../types";
import { chains, StreamVersion } from "../constants";

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
) {
  const entity: Contract = {
    id: generateContractId(event, address),
    address: address.toLowerCase(),
    // chainId: BigInt(event.chainId),
    admin: undefined,
    alias,
    version,
  };

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateContractId(event: Event, address: Address) {
  return ""
    .concat(address.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());
}

export function generateContractIdFromEvent(event: Event) {
  return ""
    .concat(event.srcAddress.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());
}

export function _initialize(event: Event): Contract[] {
  const versions = [StreamVersion.V10];

  return chains
    .map((chain) => {
      return versions
        .map((version) => {
          const FL = chain[version].flow.map((flow) =>
            createContract(event, flow.address, flow.alias, version),
          );

          return [FL].flat();
        })
        .flat();
    })
    .flat();
}
