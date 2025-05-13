import type { Config } from "@src/types";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const eventHandlers: Config.EventHandlers = {
  ...airdrops,
  ...flow,
  ...lockup,
};

export default eventHandlers;
