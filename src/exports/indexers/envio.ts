import { chains, Protocol } from "sablier";
import type { Indexer } from "../types";
import { envioRecords } from "./envio-records";

const SUPPORTED_CHAINS = [
  chains.abstract.id,
  chains.arbitrumSepolia.id,
  chains.arbitrum.id,
  chains.avalanche.id,
  chains.base.id,
  chains.baseSepolia.id,
  chains.berachain.id,
  chains.bsc.id,
  chains.chiliz.id,
  chains.ethereum.id,
  chains.ethereumSepolia.id,
  chains.gnosis.id,
  chains.linea.id,
  chains.mode.id,
  chains.morph.id,
  chains.optimism.id,
  chains.optimismSepolia.id,
  chains.polygon.id,
  chains.scroll.id,
  chains.sophon.id,
  chains.superseed.id,
  chains.tangle.id,
  chains.unichain.id,
  chains.xdc.id,
  chains.zksync.id,
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
 */
export const envioHypersync: Record<number, string> = {
  [chains.chiliz.id]: "https://chiliz.hypersync.xyz",
  [chains.tangle.id]: "https://tangle.hypersync.xyz",
};
