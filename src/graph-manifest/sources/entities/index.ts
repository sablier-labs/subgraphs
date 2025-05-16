import type { EntitiesMap } from "@src/graph-manifest/types";
import type { ProtocolMap } from "@src/types";

import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const entities: ProtocolMap<EntitiesMap> = {
  airdrops,
  flow,
  lockup,
};

export default entities;
