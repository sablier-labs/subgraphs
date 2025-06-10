import { Version } from "@sablier/deployments";
import _ from "lodash";
import PRBProxyABI from "../../../abi/PRBProxy.json";
import PRBProxyRegistryABI from "../../../abi/PRBProxyRegistry.json";
import type { Envio } from "../../common/bindings";
import { PRB_PROXY_REGISTRY } from "../../common/constants";
import { getContractVersion } from "../../common/deployments";
import { getClient } from "../../common/rpc-clients";
import { initDataEntry } from "../../common/rpc-data";
import { RPCData } from "../../common/types";

/**
 * The proxender is the owner of the proxy that is the sender of the stream.
 */
export async function fetchOrReadProxender(
  chainId: number,
  lockupAddress: Envio.Address,
  streamSender: Envio.Address,
): Promise<Envio.Address | undefined> {
  // PRBProxy was only used in Lockup v1.0
  const version = getContractVersion("lockup", chainId, lockupAddress);
  if (version !== Version.Lockup.V1_0) {
    return undefined;
  }

  const dataKey = streamSender.toLowerCase();
  const data = initDataEntry(RPCData.Category.Proxender, chainId);
  const proxender = data.read(dataKey);

  // Proxies cannot be transferred, so we can cache proxy owners.
  if (!_.isEmpty(proxender)) {
    return proxender.owner;
  }

  const client = getClient(chainId);
  const ownerResult = await client.readContract({
    abi: PRBProxyABI,
    address: streamSender as `0x${string}`,
    functionName: "owner",
  });
  if (!ownerResult) {
    return undefined;
  }
  const owner = ownerResult as Envio.Address;

  const reverseResult = await client.readContract({
    abi: PRBProxyRegistryABI,
    address: PRB_PROXY_REGISTRY as `0x${string}`,
    args: [owner],
    functionName: "getProxy",
  });
  if (!reverseResult) {
    return undefined;
  }
  const reverse = reverseResult as Envio.Address;

  // Double check that the registry has the same owner for the proxy.
  if (reverse.toLowerCase() !== streamSender.toLowerCase()) {
    console.error("Proxy registry could not retrieve proxy for owner {}", [owner as string]);
    return undefined;
  }

  data.write({ [dataKey]: { owner } });
  return owner;
}
