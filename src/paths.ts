import path, { join } from "node:path";
import appRoot from "app-root-path";
import * as fs from "fs-extra";
import type { RPCData } from "./envio/common/types";
import { getGraphChainSlug } from "./exports/indexers/graph";
import type { Types } from "./types";

const ROOT_DIR = appRoot.path;
export const SRC_DIR = join(ROOT_DIR, "src");
export const ABI_DIR = join(SRC_DIR, "abi");
export const ENVIO_DIR = join(SRC_DIR, "envio");
export const EXPORTS_DIR = join(SRC_DIR, "exports");
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
  envio: {
    config: (protocol: P): string => join(ENVIO_DIR, protocol, "config.yaml"),
    rpcData: (category: C, chain: string): string => join(ENVIO_DIR, "common", "rpc-data", category, `${chain}.json`),
    schema: (protocol: P): string => join(ENVIO_DIR, protocol, "schema.graphql"),
  },
  exports: {
    schema: (protocol: P): string => join(EXPORTS_DIR, "schemas", `${protocol}.graphql`),
    schemas: (): string => join(EXPORTS_DIR, "schemas"),
  },
  graph: {
    manifest: (protocol: P, chainId: number): string => {
      const chainSlug = getGraphChainSlug(chainId);
      return join(GRAPH_DIR, protocol, "manifests", `${chainSlug}.yaml`);
    },
    manifests: (protocol: P): string => join(GRAPH_DIR, protocol, "manifests"),
    schema: (protocol: P): string => join(GRAPH_DIR, protocol, "schema.graphql"),
  },
  schema: (vendor: V, protocol: P): string => join(SRC_DIR, vendor, protocol, "schema.graphql"),
};

export default paths;

/**
 * Returns the relative path from the directory of the start path to the end path.
 * Helpful so that we don't hardcode the paths in the codebase.
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
