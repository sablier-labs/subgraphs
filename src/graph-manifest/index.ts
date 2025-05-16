import type { IndexedProtocol } from "@src/types";
import { thrower } from "@src/winston";
import _ from "lodash";
import { createSources } from "./sources";
import { default as topSections } from "./top-sections";
import type { Manifest } from "./types";

/**
 * Creates a Graph manifest for a given protocol and chain.
 * @see https://thegraph.com/docs/en/subgraphs/developing/creating/subgraph-manifest
 */
export function createGraphManifest(protocol: IndexedProtocol, chainId: number): Manifest.TopSection {
  const topSection = topSections[protocol];
  const sources = createSources(protocol, chainId);

  if (sources.length === 0) {
    thrower.contractsNotFound(protocol, chainId);
  }

  const sourcesByType = _.groupBy(sources, "_type");
  const dataSources = _.map(sourcesByType["data-source"] || [], ({ _type, ...rest }) => rest);
  const templates = _.map(sourcesByType.template || [], ({ _type, ...rest }) => rest);

  const config = {
    ...topSection,
    dataSources: dataSources.length > 0 ? dataSources : undefined,
    templates: templates.length > 0 ? templates : undefined,
  } as Manifest.TopSection;

  return config;
}
