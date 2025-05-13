import type { Config } from "@src/types";
import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const entries: Config.ABIEntries = {
  ...airdrops,
  ...flow,
  ...lockup,
};

export default entries;
