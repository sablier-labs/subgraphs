import * as fs from "node:fs";
import * as path from "node:path";
import type { Indexed } from "./types";

export const SRC_DIR = path.resolve(__dirname);
export const ABI_DIR = path.join(SRC_DIR, "abi");
export const ENVIO_DIR = path.join(SRC_DIR, "envio");
export const GRAPH_DIR = path.join(SRC_DIR, "graph");
export const SCHEMA_DIR = path.join(SRC_DIR, "schema");

export const paths = {
  abi: (contractName: string, protocol?: Indexed.Protocol, version?: Indexed.Version): string => {
    if (protocol && version) {
      return path.join(ABI_DIR, `${protocol}-${version}`, `${contractName}.json`);
    }
    return path.join(ABI_DIR, `${contractName}.json`);
  },
  envioConfig: (protocol: Indexed.Protocol): string => path.join(ENVIO_DIR, protocol, "config.yaml"),
  envioSchema: (protocol: Indexed.Protocol): string => path.join(ENVIO_DIR, protocol, "schema.graphql"),
  graphManifests: (protocol: Indexed.Protocol): string => path.join(GRAPH_DIR, protocol, "manifests"),
  graphSchema: (protocol: Indexed.Protocol): string => path.join(GRAPH_DIR, protocol, "schema.graphql"),
};

/**
 * Returns the relative path from the directory of the start path to the end path.
 * @param from The path to the directory to start from
 * @param to The path to the directory or file to end at
 * @returns The relative path from the start path to the end path
 */
export function getRelativePath(from: string, to: string): string {
  if (!fs.existsSync(from)) {
    throw new Error(`From path '${from}' does not exist`);
  }
  if (!fs.existsSync(to)) {
    throw new Error(`To path '${to}' does not exist`);
  }
  // Use the directory of the `from` path if it's a file.
  let fromDir = from;
  if (fs.lstatSync(from).isFile()) {
    fromDir = path.dirname(from);
  }
  return path.relative(fromDir, to);
}
