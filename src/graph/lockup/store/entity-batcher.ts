import { Address } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import * as Entity from "../bindings/schema";

export function getOrCreateBatcher(sender: Address): Entity.Batcher {
  const id = sender.toHexString();
  let batcher = Entity.Batcher.load(id);

  if (batcher === null) {
    batcher = new Entity.Batcher(id);
    batcher.batchCounter = ZERO;
    batcher.save();
  }

  return batcher;
}
