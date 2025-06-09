import { sablier } from "@sablier/deployments";
import { get_rpcs_for_chain as getRPCs } from "chainlist-rpcs";
import _ from "lodash";
import { createPublicClient, fallback, http, type PublicClient } from "viem";
import { ENVIO_CHAIN_CONFIGS } from "../../exports/chains";
import { IndexingError } from "./error";

/**
 * Global array of pre-configured public clients for all supported chains.
 * Each client is configured with multiple RPC endpoints for failover resilience.
 */
const clients: PublicClient[] = [];

// Initialize RPC clients for all supported chains
for (const config of ENVIO_CHAIN_CONFIGS) {
  // Get chain configuration from Sablier deployments
  const chain = sablier.chains.getOrThrow(config.id);

  // Build priority-ordered list of RPC URLs
  const rpcUrls: string[] = [];

  // 1. Add HyperSync endpoint (highest priority for indexing)
  if (config.hypersync) {
    rpcUrls.push(config.hypersync);
  }

  // 2. Add Infura and Alchemy endpoints if keys are available
  if (chain.rpc.infura && process.env.ENVIO_INFURA_API_KEY) {
    const infuraURL = chain.rpc.infura(process.env.ENVIO_INFURA_API_KEY);
    rpcUrls.push(infuraURL);
  }
  if (chain.rpc.alchemy && process.env.ENVIO_ALCHEMY_API_KEY) {
    const alchemyURL = chain.rpc.alchemy(process.env.ENVIO_ALCHEMY_API_KEY);
    rpcUrls.push(alchemyURL);
  }

  // 3. Add default chain RPC as provided by the Sablier deployments package, which sources it from Viem.
  if (chain.rpc.default) {
    rpcUrls.push(chain.rpc.default);
  }

  // 4. Add public RPCs from chainlist as fallbacks
  const publicRpcUrls = getRPCs({ chain_id: chain.id })
    .map((rpc) => {
      const url = typeof rpc === "string" ? rpc : rpc.url;
      return url.startsWith("http") ? url : undefined;
    })
    .filter(Boolean) as string[];

  rpcUrls.push(...publicRpcUrls);

  // Remove duplicates while preserving order
  const uniqueRpcUrls = _.uniq(rpcUrls);

  // Create HTTP transports with batching enabled for performance
  const transports = uniqueRpcUrls.map((url) =>
    http(url, {
      batch: true, // Enable request batching for better performance
    }),
  );

  // Create public client with fallback transport for resilience
  const client = createPublicClient({
    batch: {
      multicall: true, // Enable multicall batching
    },
    chain,
    transport: fallback(transports, {
      rank: false, // Use RPCs in order of priority, not by performance ranking
      retryCount: 5, // Retry failed requests up to 5 times
    }),
  });

  clients.push(client);
}

/**
 * Retrieves a pre-configured public client for the specified chain.
 *
 * @param chainId - The chain ID to get the client for
 * @returns PublicClient configured with multiple RPC endpoints for the chain
 * @throws IndexingError.ClientNotFound if no client exists for the chain
 */
export function getClient(chainId: number): PublicClient {
  const client = clients.find((c) => c?.chain?.id === chainId);

  if (!client) {
    throw new IndexingError.ClientNotFound(chainId);
  }

  return client;
}
