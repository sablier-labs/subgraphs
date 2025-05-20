import * as EntityAction from "./entity-action";
import * as EntityAsset from "./entity-asset";
import * as EntityBatch from "./entity-batch";
import * as EntityBatcher from "./entity-batcher";
import * as EntitySegment from "./entity-segment";
import * as EntityStream from "./entity-stream";
import * as EntityTranche from "./entity-tranche";
import * as EntityWatcher from "./entity-watcher";

export namespace Store {
  export import Action = EntityAction;
  export import Asset = EntityAsset;
  export import Batch = EntityBatch;
  export import Batcher = EntityBatcher;
  export import Segment = EntitySegment;
  export import Stream = EntityStream;
  export import Tranche = EntityTranche;
  export import Watcher = EntityWatcher;
}
