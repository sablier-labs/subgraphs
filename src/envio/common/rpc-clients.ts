import { sablier } from "@sablier/deployments";
import _ from "lodash";
import { createPublicClient, fallback, http, type PublicClient } from "viem";
import { envioChains } from "../../chains";
import { IndexingError } from "./error";

const clients: PublicClient[] = [];

for (const envioChain of envioChains) {
  const chain = sablier.chains.getOrThrow(envioChain.id);

  // @todo: add multiple RPC URLs
  const URLs = _.compact([chain.rpcUrls.default.http[0], envioChain.envio.hypersync]).map((url) => http(url));
  const transport = fallback(URLs, {
    rank: false,
    retryCount: 5,
  });
  const client = createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport,
  });
  clients.push(client);
}

export function getClient(chainId: number) {
  const client = clients.find((c) => c?.chain?.id.toString() === chainId.toString());

  if (!client) {
    throw new IndexingError.ClientNotFound(chainId);
  }

  return client;
}
