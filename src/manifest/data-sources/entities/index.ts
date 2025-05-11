import type { Config } from "@src/types";
import flow from "./flow";
import lockup from "./lockup";

const entities: Config.Map.Entities = {
  ...flow,
  ...lockup,
};

export default entities;
