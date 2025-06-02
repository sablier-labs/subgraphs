import { Errors } from "@src/errors";
import type { Indexed } from "@src/types";
import _ from "lodash";
import { createSources } from "./sources";
import { default as topSections } from "./top-sections";
import type { GraphManifest } from "./types";

/**
 * Creates a Graph manifest for a given protocol and chain.
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest
 */
export function createGraphManifest(protocol: Indexed.Protocol, chainId: number): GraphManifest.TopSection {
  const topSection = topSections[protocol];
  const sources = createSources(protocol, chainId);

  if (sources.length === 0) {
    throw new Errors.ContractsNotFound(protocol, chainId);
  }

  const sourcesByType = _.groupBy(sources, "_type");
  const dataSources = _.map(sourcesByType["data-source"], (source) => _.omit(source, "_type"));
  const templates = _.map(sourcesByType.template, (source) => _.omit(source, "_type"));

  const config = {
    ...topSection,
    dataSources: dataSources.length > 0 ? dataSources : undefined,
    templates: templates.length > 0 ? templates : undefined,
  } as GraphManifest.TopSection;

  return config;
}
