import { createAction } from "./entity-action";
import { getOrCreateAsset } from "./entity-asset";
import { getOrCreateBatch } from "./entity-batch";
import { createSegment } from "./entity-segment";
import { createStreamDynamic, createStreamLinear, createStreamTranched, getStream } from "./entity-stream";
import { createTranche } from "./entity-tranche";
import { getOrCreateWatcher } from "./entity-watcher";

export namespace Store {
  export namespace Action {
    export const create = createAction;
  }

  export namespace Asset {
    export const getOrCreate = getOrCreateAsset;
  }

  export namespace Batch {
    export const getOrCreate = getOrCreateBatch;
  }

  export namespace Segment {
    export const create = createSegment;
  }

  export namespace Stream {
    export const createDynamic = createStreamDynamic;
    export const createLinear = createStreamLinear;
    export const createTranched = createStreamTranched;
    export const get = getStream;
  }

  export namespace Tranche {
    export const create = createTranche;
  }

  export namespace Watcher {
    export const getOrCreate = getOrCreateWatcher;
  }
}
