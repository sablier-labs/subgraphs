import { Protocol } from "sablier";
import type { Indexer } from "../types";
import { envioConfigs } from "../vendors";
import { resolveEnvio } from "./resolver";

export const envioIds: Record<Indexer.Protocol, Indexer.EnvioId> = {
  airdrops: {
    createdOn: 1_712_673_343, // April 8, 2024
    id: "508d217",
    isLatest: true,
    protocol: Protocol.Airdrops,
  },
  flow: {
    createdOn: 1_731_318_958, // November 1, 2024
    id: "3b4ea6b",
    isLatest: true,
    protocol: Protocol.Flow,
  },
  lockup: {
    createdOn: 1_712_673_343, // April 8, 2024
    id: "53b7e25",
    isLatest: true,
    protocol: Protocol.Lockup,
  },
};

function get(protocol: Indexer.Protocol): Indexer[] {
  return envioConfigs.map((c) => {
    return resolveEnvio(envioIds[protocol].id, protocol, c.chainId);
  });
}

export const envio: Record<Indexer.Protocol, Indexer[]> = {
  airdrops: get(Protocol.Airdrops),
  flow: get(Protocol.Flow),
  lockup: get(Protocol.Lockup),
} as const;
