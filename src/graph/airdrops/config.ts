import { Address } from "@graphprotocol/graph-ts";
import { dynamic, factory, linear, merged, tranched } from "./bindings/env";

export const StreamVersion_V20 = "V20"; /** Not in use */
export const StreamVersion_V21 = "V21";
export const StreamVersion_V22 = "V22";
export const StreamVersion_V23 = "V23";

export function getContractsFactory(): string[][] {
  if (factory.length === 0) {
    return [];
  }
  return factory.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V21,
  ]);
}

export function getContractsShapes(): string[][] {
  let aggregate: string[][] = [];

  if (linear.length !== 0) {
    aggregate = aggregate.concat(linear);
  }
  if (dynamic.length !== 0) {
    aggregate = aggregate.concat(dynamic);
  }
  if (tranched.length !== 0) {
    aggregate = aggregate.concat(tranched);
  }
  if (merged.length !== 0) {
    aggregate = aggregate.concat(merged);
  }

  return aggregate.map<string[]>((item: string[]) => [
    item[0].toString().toLowerCase(),
    item[1].toString().toLowerCase(),
    item.length >= 3 ? item[2].toString() : StreamVersion_V21,
  ]);
}

export function isWhitelistedShape(address: Address): bool {
  const shapes = getContractsShapes();
  const addresses = shapes.map<string>((item) => item[0].toString().toLowerCase());

  return addresses.includes(address.toHexString().toLowerCase());
}
