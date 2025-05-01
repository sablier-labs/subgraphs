import { createPublicClient, fallback, http } from "viem";
import { chains } from "../../constants";

const clients = chains
  .map((entry) => {
    const [definition, RPCs] = entry.definition || [undefined, []];

    if (definition !== undefined) {
      const client = createPublicClient({
        batch: {
          multicall: true,
        },
        chain: definition,
        transport: fallback(
          [...(definition.rpcUrls.default.http || []), ...RPCs].map((e) =>
            http(e),
          ) || [],
          {
            rank: false,
            retryCount: 5,
          },
        ),
      });

      if (client !== undefined && client?.chain?.id !== undefined) {
        return client;
      }
    }

    return undefined;
  })
  .filter((client) => client);

export function getClient(chainId: number | string | bigint) {
  const client = clients.find(
    (c) => c?.chain?.id.toString() === chainId.toString(),
  );

  if (!client) {
    console.error(clients);
    throw new Error(`Client missing from configuration for chain: ${chainId}`);
  }

  return client;
}
