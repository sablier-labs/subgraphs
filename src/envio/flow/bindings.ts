import type { HandlerArgs, LoaderArgs } from "../common/bindings";

// TODO
export { SablierFlow_v1_0 } from "./bindings/src/Handlers.gen";
export type { ActionCategory_t } from "./bindings/src/db/Enums.gen";
export type { HandlerContext, LoaderContext } from "./bindings/src/Types";

// Entities
import type {
  Action as EntityAction,
  Asset as EntityAsset,
  Batch as EntityBatch,
  Batcher as EntityBatcher,
  Stream as EntityStream,
  Watcher as EntityWatcher,
} from "./bindings/src/Types.gen";

export namespace Entity {
  export type Action = EntityAction;
  export type Asset = EntityAsset;
  export type Batch = EntityBatch;
  export type Batcher = EntityBatcher;
  export type Stream = EntityStream;
  export type Watcher = EntityWatcher;
}

// Events
// Events
import type { SablierFlow_v1_0_CreateFlowStream_eventArgs as ArgsCreate } from "./bindings/src/Types.gen";

export namespace Args {
  export type Create = ArgsCreate;
}
