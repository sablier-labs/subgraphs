import { resolveABIPath } from "./helpers";

const flow = [
  {
    name: "SablierFlow",
    get file() {
      return resolveABIPath("flow", this.name);
    },
  },
];

const ABIEntries = {
  flow: {
    "v1.0": flow,
    "v1.1": flow,
  },
};

export default ABIEntries;
