import * as EntityAction from "./entity-action";
import * as EntityAsset from "./entity-asset";
import * as EntityBatch from "./entity-batch";
import * as EntityBatcher from "./entity-batcher";
import * as EntityStream from "./entity-stream";

export namespace Store {
  export import Action = EntityAction;
  export import Asset = EntityAsset;
  export import Batch = EntityBatch;
  export import Batcher = EntityBatcher;
  export import Stream = EntityStream;
}
