import type { Context, Entity } from "@envio-airdrops/bindings";
import type { Address } from "@envio-common/bindings";
import { getContractAlias } from "@envio-common/deployments";

export async function create(
  context: Context.Handler,
  chainId: number,
  factoryAddress: Address,
): Promise<Entity.Factory> {
  const address = factoryAddress.toLowerCase();
  const factory: Entity.Factory = {
    address,
    alias: getContractAlias("airdrops", chainId, address),
    campaignCounter: 0n,
    chainId: BigInt(chainId),
    id: address,
  };
  await context.Factory.set(factory);
  return factory;
}
