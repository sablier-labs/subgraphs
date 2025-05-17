import indexedEvents from "@src/events";
import { resolveEventHandler } from "@src/events/resolvers";
import type { EventHandlersMap } from "@src/graph-manifest/types";
import type { Indexed, ProtocolMap } from "@src/types";
import _ from "lodash";

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
