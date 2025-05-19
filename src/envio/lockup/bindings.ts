// Context
import type { HandlerContext, LoaderContext } from "./bindings/src/Types";
export namespace Context {
  export type Handler = HandlerContext;
  export type Loader = LoaderContext;
}

// Enums
import type { ActionCategory_t, StreamCategory_t } from "./bindings/src/db/Enums.gen";
export namespace EnvioEnum {
  export type ActionCategory = ActionCategory_t;
  export type StreamCategory = StreamCategory_t;
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
