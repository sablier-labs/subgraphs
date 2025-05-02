import { StreamVersion, chains } from "../constants";
import type { Address, Event, Factory } from "../types";

export async function getFactory(event: Event, address: Address, loader: (id: string) => Promise<Factory | undefined>) {
  const id = generateFactoryId(event, address);
  const loaded = await loader(id);

  if (!loaded) {
    throw new Error("Missing factory instance");
  }
  return loaded;
}

export function createFactory(event: Event, address: Address, alias: string, version: StreamVersion) {
  const entity: Factory = {
    id: generateFactoryId(event, address),
    address: address.toLowerCase(),
    chainId: BigInt(event.chainId),
    alias: alias.toLowerCase(),
    version,
  };

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateFactoryId(event: Event, address: Address) {
  return "".concat(address.toLowerCase()).concat("-").concat(event.chainId.toString());
}

export function generateFactoryIdFromEvent(event: Event) {
  return "".concat(event.srcAddress.toLowerCase()).concat("-").concat(event.chainId.toString());
}

export function _initialize(event: Event): Factory[] {
  const versions = [StreamVersion.V21, StreamVersion.V22, StreamVersion.V23];

  return chains.flatMap((chain) => {
    return versions.flatMap((version) => {
      const MSF = chain[version].factory.map((f) => createFactory(event, f.address, f.alias, version));

      return [MSF].flat();
    });
  });
}
