import { createPublicClient, http, fallback } from "viem";
import * as library from "viem/chains";
import { fallbacks } from "./rpc";
import { chains } from "../../constants";

const supported = chains.map((local) =>
  Object.values(library).find((remote) => remote.id === local.id),
);

const clients = supported.map((chain) =>
  createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport: fallback(
      fallbacks
        .find((f) => f.id === chain?.id)
        ?.rpcEndpoints.map((e) => http(e)) || [],
      {
        rank: false,
        retryCount: 5,
      },
    ),
  }),
);

export function getClient(chainId: number | string | bigint) {
  const client = clients.find(
    (c) => c.chain.id.toString() === chainId.toString(),
  );

  if (!client) {
    throw new Error(`Client missing from configuration for chain: ${chainId}`);
  }

  return client;
}
