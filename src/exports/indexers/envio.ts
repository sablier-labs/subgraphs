import { Protocol } from "@sablier/deployments";
import { envioChains } from "../chains";
import { resolveEnvio } from "../resolver";
import type { Indexer } from "../types";

const get = (protocol: Indexer.Protocol): Indexer.Envio[] => {
  return envioChains.map((c) => resolveEnvio(protocol, c.id));
};

export const envio: Record<Indexer.Protocol, Indexer.Envio[]> = {
  airdrops: get(Protocol.Airdrops),
  flow: get(Protocol.Flow),
  lockup: get(Protocol.Lockup),
} as const;
