import * as path from "node:path";
import { ENVIO_DIR, GRAPH_DIR } from "@src/paths";
import { compareSync, type Entry, type FilterHandler, filterHandlers, type Options } from "dir-compare";

const filterHandler: FilterHandler = (entry: Entry, relativePath: string, options: Options): boolean => {
  if (!options.fileExtension) {
    return filterHandlers.defaultFilterHandler(entry, relativePath, options);
  }
  if (entry.name === "loader.ts") {
    return false;
  }
  return true;
};

const opts: Options = {
  compareContent: false, // Only check file structure
  fileExtension: "ts",
  filterHandler,
  skipSymlinks: true,
};

describe("Mappings", () => {
  it("should have the same directory structure between Envio and The Graph", () => {
    const airdropsRes = compareSync(
      path.join(ENVIO_DIR, "airdrops", "mappings"),
      path.join(GRAPH_DIR, "airdrops", "mappings"),
      opts,
    );
    expect(airdropsRes.same).toBe(true);

    const flowRes = compareSync(
      path.join(ENVIO_DIR, "flow", "mappings"),
      path.join(GRAPH_DIR, "flow", "mappings"),
      opts,
    );
    console.log({
      diffSet: flowRes.diffSet,
      flowRes,
    });
    expect(flowRes.same).toBe(true);

    const lockupRes = compareSync(
      path.join(ENVIO_DIR, "lockup", "mappings"),
      path.join(GRAPH_DIR, "lockup", "mappings"),
      opts,
    );
    expect(lockupRes.same).toBe(true);
  });
});
