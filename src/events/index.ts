import type { Types } from "../types";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

export const indexedEvents: Types.ProtocolMap<Types.EventMap> = {
  airdrops,
  flow,
  lockup,
};
