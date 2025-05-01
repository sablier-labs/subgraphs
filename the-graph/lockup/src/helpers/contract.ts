import { Address } from "@graphprotocol/graph-ts";
import { SablierLockupInitializer as SablierLockupContract } from "../generated/types/ContractInitializer/SablierLockupInitializer";
import { Contract } from "../generated/types/schema";

export function getContractByAddress(address: Address): Contract | null {
  return Contract.load(generateContractId(address));
}

export function createContract(
  address: Address,
  alias: string,
  version: string,
  category: string,
): Contract {
  let id = generateContractId(address);
  let entity = getContractByAddress(address);

  if (entity == null) {
    entity = new Contract(id);
  }

  entity.alias = alias;
  entity.address = address;
  entity.category = category;
  entity.version = version;

  /**
   * For contracts that aren't on-chain at this time, the admin will be picked up by the TransferAdmin event.
   * For initializers, the following code will resolve the admin address as the TransferAdmin event may not be picked up.
   */

  let contract = SablierLockupContract.bind(address);
  let admin = contract.try_admin();
  if (!admin.reverted) {
    entity.admin = admin.value;
  }

  entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateContractId(address: Address): string {
  return "".concat(address.toHexString());
}
