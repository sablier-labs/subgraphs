import { Protocol } from "@sablier/deployments";
import { ENVIO_CHAINS } from "../chains";
import type { Indexer } from "../types";
import { resolveEnvio } from "./resolver";

const get = (protocol: Indexer.Protocol): Indexer.Envio[] => {
  return ENVIO_CHAINS.map((c) => resolveEnvio(protocol, c.id));
};

export const envio: Record<Indexer.Protocol, Indexer.Envio[]> = {
  airdrops: get(Protocol.Airdrops),
  flow: get(Protocol.Flow),
  lockup: get(Protocol.Lockup),
} as const;
