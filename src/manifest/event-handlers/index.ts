import type { Config } from "../../types";
import flow from "./flow";
import lockup from "./lockup";

const eventHandlers: Config.Map.EventHandlers = {
  ...flow,
  ...lockup,
};

export default eventHandlers;
