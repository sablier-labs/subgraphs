import type { Config } from "@src/types";

import airdrops from "./airdrops";
import flow from "./flow";
import lockup from "./lockup";

const entities: Config.Entities = {
  ...airdrops,
  ...flow,
  ...lockup,
};

export default entities;
