import { Address } from "@graphprotocol/graph-ts";
import { ContractFlow, EntityContract } from "../bindings";

export function createContract(address: Address, alias: string, version: string): EntityContract {
  const id = address.toHexString();
  let entity = EntityContract.load(id);
  if (entity == null) {
    entity = new EntityContract(id);
  }

  entity.alias = alias;
  entity.address = address;
  entity.version = version;

  /**
   * For contracts that aren't available onchain yet, the admin will be picked up by the TransferAdmin event.
   * For initializers, the following code will resolve the admin address as the TransferAdmin event may not be picked up.
   */

  const contract = ContractFlow.bind(address);
  const admin = contract.try_admin();
  if (!admin.reverted) {
    entity.admin = admin.value;
  }

  entity.save();
  return entity;
}
