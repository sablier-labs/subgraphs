import type { IndexedProtocol } from "@src/types";
import { createContracts } from "./contracts";
import { createNetworks } from "./networks";
import { default as topSections } from "./top-sections";
import type { EnvioConfig } from "./types";

/**
 * Creates a Graph manifest for a given protocol and chain.
 * @see https://docs.envio.dev/docs/HyperIndex/configuration-file#interactive-schema-explorer
 */
export function createEnvioConfig(protocol: IndexedProtocol): EnvioConfig.TopSection {
  const topSection = topSections[protocol];
  const contracts = createContracts(protocol);
  const networks = createNetworks(protocol);

  const config = {
    ...topSection,
    contracts,
    networks,
  } as EnvioConfig.TopSection;

  return config;
}
