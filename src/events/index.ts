import type { Indexed, ProtocolMap } from "../types";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const indexedEvents: ProtocolMap<Indexed.EventMap> = {
  airdrops,
  flow,
  lockup,
};

export default indexedEvents;
