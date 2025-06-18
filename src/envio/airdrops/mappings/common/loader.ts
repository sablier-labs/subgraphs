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
  SablierFactoryMerkleInstant_v1_4_CreateMerkleInstant_loader as CreateInstant_v1_4,
  SablierFactoryMerkleLL_v1_4_CreateMerkleLL_loader as CreateLL_v1_4,
  SablierFactoryMerkleLT_v1_4_CreateMerkleLT_loader as CreateLT_v1_4,
  SablierFactoryMerkleVCA_v1_4_CreateMerkleVCA_loader as CreateVCA_v1_4,
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
    return loaderForCreate(context, event, event.params.asset);
  };

  type CreateV1_2<T> = CreateLL_v1_2<T> & CreateLT_v1_2<T>;
  const createV1_2: CreateV1_2<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.baseParams[0]);
  };

  type CreateV1_3<T> = CreateInstant_v1_3<T> & CreateLL_v1_3<T> & CreateLT_v1_3<T>;
  const createV1_3: CreateV1_3<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.baseParams[0]);
  };

  type CreateInstantV1_4<T> = CreateInstant_v1_4<T>;
  const createInstantV1_4: CreateInstantV1_4<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.params[5]);
  };

  type CreateVCAV1_4<T> = CreateVCA_v1_4<T>;
  const createVCAV1_4: CreateVCAV1_4<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.params[7]);
  };

  type CreateLLV1_4<T> = CreateLL_v1_4<T>;
  const createLLV1_4: CreateLLV1_4<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.params[12]);
  };

  type CreateLTV1_4<T> = CreateLT_v1_4<T>;
  const createLTV1_4: CreateLTV1_4<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, event.params.params[9]);
  };

  export const create = {
    [Version.Airdrops.V1_1]: createV1_1,
    [Version.Airdrops.V1_2]: createV1_2,
    [Version.Airdrops.V1_3]: createV1_3,
  };

  export const createInstant = {
    [Version.Airdrops.V1_4]: createInstantV1_4,
  };

  export const createLL = {
    [Version.Airdrops.V1_4]: createLLV1_4,
  };

  export const createLT = {
    [Version.Airdrops.V1_4]: createLTV1_4,
  };

  export const createVCA = {
    [Version.Airdrops.V1_4]: createVCAV1_4,
  };
}
