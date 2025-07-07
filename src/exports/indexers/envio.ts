/**
 * @file Use this file to define new indexers for Envio.
 *
 * @see https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks
 */
import { chains, Protocol } from "sablier";
import { Vendor } from "../enums";
import type { Indexer } from "../types";
import { envioRecords } from "./envio-records";

const SUPPORTED_CHAINS = [
  /* -------------------------------------------------------------------------- */
  /*                                  MAINNETS                                  */
  /* -------------------------------------------------------------------------- */
  chains.abstract.id,
  chains.arbitrum.id,
  chains.avalanche.id,
  chains.base.id,
  chains.berachain.id,
  chains.bsc.id,
  chains.chiliz.id,
  chains.gnosis.id,
  chains.linea.id,
  chains.mainnet.id,
  chains.mode.id,
  chains.morph.id,
  chains.optimism.id,
  chains.polygon.id,
  chains.scroll.id,
  chains.sophon.id,
  chains.superseed.id,
  chains.tangle.id,
  chains.unichain.id,
  chains.xdc.id,
  chains.zksync.id,
  /* -------------------------------------------------------------------------- */
  /*                                  TESTNETS                                  */
  /* -------------------------------------------------------------------------- */
  chains.arbitrumSepolia.id,
  chains.baseSepolia.id,
  chains.optimismSepolia.id,
  chains.sepolia.id,
] as const;

function get(protocol: Indexer.Protocol): Indexer[] {
  return SUPPORTED_CHAINS.map((chainId) => {
    const record = envioRecords[protocol];
    return {
      chainId,
      endpoint: {
        id: record.endpoint.id,
        url: record.endpoint.url,
      },
      explorerURL: record.explorerURL,
      kind: "official",
      name: `sablier-${protocol}`,
      protocol,
      testingURL: `https://cloud.hasura.io/public/graphiql?endpoint=${encodeURIComponent(record.endpoint.url)}`,
      vendor: Vendor.Envio,
    };
  });
}

export const envio: Record<Indexer.Protocol, Indexer[]> = {
  airdrops: get(Protocol.Airdrops),
  flow: get(Protocol.Flow),
  lockup: get(Protocol.Lockup),
} as const;

export const envioChains = SUPPORTED_CHAINS;

/**
 * @see https://github.com/sablier-labs/indexers/discussions/147
 * @see @see https://github.com/enviodev/hyperindex/issues/599
 */
export const envioHypersync: Record<number, string> = {
  [chains.tangle.id]: "https://tangle.hypersync.xyz",
};
