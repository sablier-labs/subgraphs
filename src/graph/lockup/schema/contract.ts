import { Address } from "@graphprotocol/graph-ts";
import { EntityContract, SablierLockupInitializer } from "../bindings";

export function createContract(address: Address, alias: string, version: string, category: string): EntityContract {
  const id = address.toHexString();
  let entity = EntityContract.load(id);

  if (entity == null) {
    entity = new EntityContract(id);
  }

  entity.alias = alias;
  entity.address = address;
  entity.category = category;
  entity.version = version;

  /**
   * For contracts that aren't onchain at this time, the admin will be picked up by the TransferAdmin event.
   * For initializers, the following code will resolve the admin address as the TransferAdmin event may not be picked up.
   */

  const contract = SablierLockupInitializer.bind(address);
  const admin = contract.try_admin();
  if (!admin.reverted) {
    entity.admin = admin.value;
  }

  entity.save();
  return entity;
}
