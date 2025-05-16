import type { IndexedEventMap, ProtocolMap } from "@src/types";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const indexedEvents: ProtocolMap<IndexedEventMap> = {
  airdrops,
  flow,
  lockup,
};

export default indexedEvents;
