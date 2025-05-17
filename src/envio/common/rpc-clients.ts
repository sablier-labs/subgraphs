import { getChain } from "@sablier/deployments";
import { logAndThrow } from "@src/winston";
import _ from "lodash";
import { http, type PublicClient, createPublicClient, fallback } from "viem";
import { envioChains } from "../../chains";
import { IndexingError } from "./error";

const clients: PublicClient[] = [];

for (const envioChain of envioChains) {
  const chain = getChain(envioChain.id);
  if (!chain) {
    logAndThrow(`Chain object not found for chain with ID ${envioChain.id}`);
  }

  const URLs = _.compact([chain.rpc.public, envioChain.envio.hypersync]).map((url) => http(url));
  const transport = fallback(URLs, {
    rank: false,
    retryCount: 5,
  });
  const client = createPublicClient({
    batch: {
      multicall: true,
    },
    // TODO: add chain definition
    // chain,
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
