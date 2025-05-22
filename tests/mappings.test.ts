import * as path from "node:path";
import { ENVIO_DIR, GRAPH_DIR } from "@src/paths";
import { compareSync, type Entry, type FilterHandler, type Options } from "dir-compare";

const filterHandler: FilterHandler = (entry: Entry): boolean => {
  if (!entry.path.endsWith("*.ts")) {
    return false;
  }
  // Only Envio has loaders
  if (entry.name === "loader.ts") {
    return false;
  }
  return true;
};

const opts: Options = {
  compareContent: false, // Only check file structure
  filterHandler,
  skipSymlinks: true,
};

describe("Mappings", () => {
  describe("Same directory structure between Envio and The Graph", () => {
    it("Airdrops", () => {
      const airdropsRes = compareSync(
        path.join(ENVIO_DIR, "airdrops", "mappings"),
        path.join(GRAPH_DIR, "airdrops", "mappings"),
        opts,
      );
      expect(airdropsRes.same).toBe(true);
    });

    it("Flow", () => {
      const flowRes = compareSync(
        path.join(ENVIO_DIR, "flow", "mappings"),
        path.join(GRAPH_DIR, "flow", "mappings"),
        opts,
      );
      expect(flowRes.same).toBe(true);
    });

    it("Lockup", () => {
      const lockupRes = compareSync(
        path.join(ENVIO_DIR, "lockup", "mappings"),
        path.join(GRAPH_DIR, "lockup", "mappings"),
        opts,
      );
      expect(lockupRes.same).toBe(true);
    });
  });
});
