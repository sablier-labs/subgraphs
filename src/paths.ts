import * as fs from "node:fs";
import path, { join, resolve } from "node:path";
import type { Indexed } from "./types";

export const SRC_DIR = resolve(__dirname);
export const SRC_OUT_DIR = join(SRC_DIR, "out");
export const ABI_DIR = join(SRC_DIR, "abi");
export const GQL_DIR = join(SRC_DIR, "gql");
export const ENVIO_DIR = join(SRC_DIR, "envio");
export const GRAPH_DIR = join(SRC_DIR, "graph");
export const SCHEMA_DIR = join(SRC_DIR, "schema");

type P = Indexed.Protocol;
type V = Indexed.Vendor;

const paths = {
  abi: (contractName: string, protocol?: Indexed.Protocol, version?: Indexed.Version): string => {
    if (protocol && version) {
      return join(ABI_DIR, `${protocol}-${version}`, `${contractName}.json`);
    }
    return join(ABI_DIR, `${contractName}.json`);
  },
  envio: {
    config: (protocol: P): string => join(ENVIO_DIR, protocol, "config.yaml"),
    schema: (protocol: P): string => join(ENVIO_DIR, protocol, "schema.graphql"),
  },
  gql: {
    documents: (protocol: P | "common"): string => join(GQL_DIR, protocol, "**/*.ts"),
  },
  graph: {
    manifests: (protocol: P): string => join(GRAPH_DIR, protocol, "manifests"),
    schema: (protocol: P): string => join(GRAPH_DIR, protocol, "schema.graphql"),
  },
  out: {
    gql: (vendor: V, protocol: P): string => join(SRC_OUT_DIR, "gql", vendor, protocol, "/"),
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
