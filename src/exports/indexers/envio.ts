import { Protocol } from "sablier";
import type { Indexer } from "../types";
import { envioConfigs } from "../vendors";
import { resolveEnvio } from "./resolver";

function get(protocol: Indexer.Protocol): Indexer[] {
  return envioConfigs.map((c) => {
    return resolveEnvio(protocol, c.chainId);
  });
}

export const envio: Record<Indexer.Protocol, Indexer[]> = {
  airdrops: get(Protocol.Airdrops),
  flow: get(Protocol.Flow),
  lockup: get(Protocol.Lockup),
} as const;
