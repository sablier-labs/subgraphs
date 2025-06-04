import type { Envio } from "../../common/bindings";
import { getContractAlias } from "../../common/deployments";
import type { Context, Entity } from "../bindings";

export async function create(
  context: Context.Handler,
  chainId: number,
  factoryAddress: Envio.Address,
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
