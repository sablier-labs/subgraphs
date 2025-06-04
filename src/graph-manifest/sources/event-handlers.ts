import _ from "lodash";
import indexedEvents from "../../events";
import { resolveEventHandler } from "../../events/resolver";
import type { Indexed, ProtocolMap } from "../../types";
import type { EventHandlersMap } from "../manifest-types";

function get(protocol: Indexed.Protocol): EventHandlersMap {
  return _.mapValues(indexedEvents[protocol], (versions) =>
    _.mapValues(versions, (events) => events.map(resolveEventHandler)),
  );
}

const eventHandlersMap: ProtocolMap<EventHandlersMap> = {
  airdrops: get("airdrops"),
  flow: get("flow"),
  lockup: get("lockup"),
};

export default eventHandlersMap;
