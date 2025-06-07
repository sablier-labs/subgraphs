import _ from "lodash";
import type { Indexer } from "../types";
import { indexers } from "./data";

type E = Indexer.Envio;
type G = Indexer.Graph;
type P = Indexer.Protocol;
type V = Indexer.Vendor;

export function getSablierIndexer(vendor: "envio", opts: { chainId: number; protocol: P }): E | undefined;
export function getSablierIndexer(vendor: "graph", opts: { chainId: number; protocol: P }): G | undefined;
export function getSablierIndexer(vendor: V, opts: { chainId: number; protocol: P }): E | G | undefined {
  const { chainId, protocol } = opts;
  if (vendor === "envio") {
    return _.find(indexers.envio[protocol], { chainId });
  } else {
    return _.find(indexers.graph[protocol], { chainId });
  }
}

export const getSablierGraphIndexer = (opts: { chainId: number; protocol: P }): G | undefined =>
  getSablierIndexer("graph", opts);
export const getSablierEnvioIndexer = (opts: { chainId: number; protocol: P }): E | undefined =>
  getSablierIndexer("envio", opts);
