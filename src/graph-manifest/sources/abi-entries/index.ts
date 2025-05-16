import type { ABIEntriesMap } from "@src/graph-manifest/types";
import type { ProtocolMap } from "@src/types";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const entries: ProtocolMap<ABIEntriesMap> = {
  airdrops,
  flow,
  lockup,
};

export default entries;
