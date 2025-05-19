// Context
import type { HandlerContext, LoaderContext } from "./bindings/src/Types";
export namespace Context {
  export type Handler = HandlerContext;
  export type Loader = LoaderContext;
}

// Contracts
// Note: all Flow contracts have the same ABI now. The export name may have to be updated in the future.
export { SablierFlow_v1_0 as SablierFlow } from "./bindings/src/Handlers.gen";

// Enums
import type { ActionCategory_t } from "./bindings/src/db/Enums.gen";
export namespace Enum {
  export type ActionCategory = ActionCategory_t;
}

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
import type { SablierFlow_v1_0_CreateFlowStream_eventArgs as ArgsCreate } from "./bindings/src/Types.gen";
export namespace Args {
  export type Create = ArgsCreate;
}
