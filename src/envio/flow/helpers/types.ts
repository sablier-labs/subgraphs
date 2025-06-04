import type { Envio } from "../../common/bindings";
import type { Entity } from "../bindings";

export type CreateEntities = {
  asset: Entity.Asset;
  batch: Entity.Batch;
  batcher: Entity.Batcher;
  watcher: Entity.Watcher;
};

export namespace Params {
  export type Create = {
    recipient: Envio.Address;
    ratePerSecond: bigint;
    sender: Envio.Address;
    tokenId: bigint;
    transferable: boolean;
  };
}
