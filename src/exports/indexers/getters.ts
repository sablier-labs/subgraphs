import _ from "lodash";
import type { Indexer } from "../types";
import { indexers } from "./data";

type I = Indexer;
type P = Indexer.Protocol;
type V = Indexer.Vendor;

export function getSablierIndexer(vendor: V, opts: { chainId: number; protocol: P }): I | undefined {
  const { chainId, protocol } = opts;
  if (vendor === "envio") {
    return _.find(indexers.envio[protocol], (c) => c.chainId === chainId);
  } else {
    return _.find(indexers.graph[protocol], (c) => c.chainId === chainId);
  }
}

export const getSablierIndexerGraph = (opts: { chainId: number; protocol: P }): I | undefined =>
  getSablierIndexer("graph", opts);
export const getSablierSubgraph = getSablierIndexerGraph;
export const getSablierIndexerEnvio = (opts: { chainId: number; protocol: P }): I | undefined =>
  getSablierIndexer("envio", opts);
