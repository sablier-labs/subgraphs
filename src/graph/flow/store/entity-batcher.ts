import { Address } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { EntityBatcher } from "../bindings";

export function getOrCreateBatcher(sender: Address): EntityBatcher {
  const id = sender.toHexString();
  let batcher = EntityBatcher.load(id);

  if (batcher == null) {
    batcher = new EntityBatcher(id);
    batcher.batchCounter = ZERO;
    batcher.save();
  }

  return batcher;
}
