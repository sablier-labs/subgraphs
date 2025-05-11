import type { Config } from "@src/types";
import flow from "./flow";
import lockup from "./lockup";

const entries: Config.Map.ABIEntries = {
  ...flow,
  ...lockup,
};

export default entries;
