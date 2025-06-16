import path, { join, resolve } from "node:path";
import * as fs from "fs-extra";
import type { RPCData } from "./envio/common/types";
import type { Types } from "./types";

const ROOT_DIR = join(__dirname, "..");
if (!fs.existsSync(join(ROOT_DIR, "package.json"))) {
  throw new Error("ROOT_DIR is not set correctly");
}

export const SRC_DIR = resolve(__dirname);
export const ABI_DIR = join(SRC_DIR, "abi");
export const GQL_DIR = join(SRC_DIR, "gql");
export const ENVIO_DIR = join(SRC_DIR, "envio");
export const GRAPH_DIR = join(SRC_DIR, "graph");
export const RPC_DATA_DIR = join(SRC_DIR, "rpc-data");
export const SCHEMA_DIR = join(SRC_DIR, "schema");

type C = RPCData.Category;
type P = Types.Protocol;
type V = Types.Vendor;

const paths = {
  abi: (contractName: string, protocol?: Types.Protocol, version?: Types.Version): string => {
    if (protocol && version) {
      return join(ABI_DIR, `${protocol}-${version}`, `${contractName}.json`);
    }
    return join(ABI_DIR, `${contractName}.json`);
  },
  dist: {
    schemas: (protocol?: P): string => join(ROOT_DIR, "dist", "schemas", protocol ? `${protocol}.graphql` : ""),
  },
  envio: {
    config: (protocol: P): string => join(ENVIO_DIR, protocol, "config.yaml"),
    rpcData: (category: C, chain: string): string => join(ENVIO_DIR, "common", "rpc-data", category, `${chain}.json`),
    schema: (protocol: P): string => join(ENVIO_DIR, protocol, "schema.graphql"),
  },
  graph: {
    manifests: (protocol: P): string => join(GRAPH_DIR, protocol, "manifests"),
    schema: (protocol: P): string => join(GRAPH_DIR, protocol, "schema.graphql"),
  },
  schema: (vendor: V, protocol: P): string => join(SRC_DIR, vendor, protocol, "schema.graphql"),
};

export default paths;

/**
 * Returns the relative path from the directory of the start path to the end path.
 * @param from The path to the directory to start from
 * @param to The path to the directory or file to end at
 * @returns The relative path from the start path to the end path
 */
export function getRelativePath(from: string, to: string): string {
  // Use the directory of the `from` path if it's a file.
  let fromDir = from;
  if (fs.lstatSync(from).isFile()) {
    fromDir = path.dirname(from);
  }
  return path.relative(fromDir, to);
}
