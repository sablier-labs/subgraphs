import type { Address } from "@envio-common/bindings";
import type { Entity } from "@envio-flow/bindings";

export type CreateEntities = {
  asset: Entity.Asset;
  batch: Entity.Batch;
  batcher: Entity.Batcher;
  watcher: Entity.Watcher;
};

export namespace Params {
  export type Create = {
    recipient: Address;
    ratePerSecond: bigint;
    sender: Address;
    tokenId: bigint;
    transferable: boolean;
  };
}
