/**
 * @file Reusable Envio loaders
 * @see https://docs.envio.dev/docs/HyperIndex/loaders
 */

import { Version } from "sablier";
import type { Envio } from "../../../common/bindings";
import { Effects } from "../../../common/effects";
import { Id } from "../../../common/id";
import { type RPCData } from "../../../common/types";
import type { Context, Entity } from "../../bindings";
import type {
  SablierMerkleFactory_v1_3_CreateMerkleInstant_loader as CreateInstant_v1_3,
  SablierV2MerkleStreamerFactory_v1_1_CreateMerkleStreamerLL_loader as CreateLL_v1_1,
  SablierV2MerkleLockupFactory_v1_2_CreateMerkleLL_loader as CreateLL_v1_2,
  SablierMerkleFactory_v1_3_CreateMerkleLL_loader as CreateLL_v1_3,
  SablierV2MerkleLockupFactory_v1_2_CreateMerkleLT_loader as CreateLT_v1_2,
  SablierMerkleFactory_v1_3_CreateMerkleLT_loader as CreateLT_v1_3,
} from "../../bindings/src/Types.gen";

export namespace Loader {
  /* -------------------------------------------------------------------------- */
  /*                                   CREATE                                   */
  /* -------------------------------------------------------------------------- */

  export type CreateReturn = {
    asset?: Entity.Asset;
    assetMetadata: RPCData.ERC20Metadata;
    factory?: Entity.Factory;
    watcher?: Entity.Watcher;
  };

  async function loaderForCreate(
    context: Context.Loader,
    event: Envio.Event,
    assetAddress: Envio.Address,
  ): Promise<CreateReturn> {
    const assetMetadata = await context.effect(Effects.ERC20.readOrFetchMetadata, {
      address: assetAddress,
      chainId: event.chainId,
    });
    const assetId = Id.asset(event.chainId, assetAddress);
    const asset = await context.Asset.get(assetId);

    const factoryId = event.srcAddress;
    const factory = await context.Factory.get(factoryId);

    const watcherId = event.chainId.toString();
    const watcher = await context.Watcher.get(watcherId);
    return {
      asset,
      assetMetadata,
      factory,
      watcher,
    };
  }

  type CreateV1_1<T> = CreateLL_v1_1<T>;
  const createV1_1: CreateV1_1<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.merkleStreamer);
  };

  type CreateV1_2<T> = CreateLL_v1_2<T> & CreateLT_v1_2<T>;
  const createV1_2: CreateV1_2<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.baseParams[0]);
  };

  type CreateV1_3<T> = CreateInstant_v1_3<T> & CreateLL_v1_3<T> & CreateLT_v1_3<T>;
  const createV1_3: CreateV1_3<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.baseParams[0]);
  };

  export const create = {
    [Version.Airdrops.V1_1]: createV1_1,
    [Version.Airdrops.V1_2]: createV1_2,
    [Version.Airdrops.V1_3]: createV1_3,
  };
}
