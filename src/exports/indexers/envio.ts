import { Protocol } from "@sablier/deployments";
import type { Indexer } from "../types";
import { ENVIO_CONFIGS } from "../vendors";
import { resolveEnvio } from "./resolver";

const get = (protocol: Indexer.Protocol): Indexer[] => {
  return ENVIO_CONFIGS.map((c) => resolveEnvio(protocol, c.chainId));
};

export const envio: Record<Indexer.Protocol, Indexer[]> = {
  airdrops: get(Protocol.Airdrops),
  flow: get(Protocol.Flow),
  lockup: get(Protocol.Lockup),
} as const;
