/**
 * @file Reusable Envio loaders
 * @see https://docs.envio.dev/docs/HyperIndex/loaders
 */
import type { Address, Event } from "@envio-common/bindings";
import { Id } from "@envio-common/id";
import type { Context, Entity } from "@envio-lockup/bindings";
import type {
  SablierV2LockupLinear_v1_0_Approval_loader as Approval_v1_0,
  SablierV2LockupLinear_v1_1_Approval_loader as Approval_v1_1,
  SablierV2LockupLinear_v1_2_Approval_loader as Approval_v1_2,
  SablierLockup_v2_0_Approval_loader as Approval_v2_0,
  SablierV2LockupLinear_v1_0_CancelLockupStream_loader as Cancel_v1_0,
  SablierV2LockupLinear_v1_1_CancelLockupStream_loader as Cancel_v1_1_to_v2_0,
  SablierV2LockupDynamic_v1_0_CreateLockupDynamicStream_loader as CreateDynamic_v1_0,
  SablierV2LockupDynamic_v1_1_CreateLockupDynamicStream_loader as CreateDynamic_v1_1,
  SablierV2LockupDynamic_v1_2_CreateLockupDynamicStream_loader as CreateDynamic_v1_2,
  SablierLockup_v2_0_CreateLockupDynamicStream_loader as CreateDynamic_v2_0,
  SablierV2LockupLinear_v1_0_CreateLockupLinearStream_loader as CreateLinear_v1_0,
  SablierV2LockupLinear_v1_1_CreateLockupLinearStream_loader as CreateLinear_v1_1,
  SablierV2LockupLinear_v1_2_CreateLockupLinearStream_loader as CreateLinear_v1_2,
  SablierLockup_v2_0_CreateLockupLinearStream_loader as CreateLinear_v2_0,
  SablierV2LockupTranched_v1_2_CreateLockupTranchedStream_loader as CreateTranched_v1_2,
  SablierLockup_v2_0_CreateLockupTranchedStream_loader as CreateTranched_v2_0,
  SablierV2LockupLinear_v1_0_RenounceLockupStream_loader as Renounce_v1_0,
  SablierV2LockupLinear_v1_1_RenounceLockupStream_loader as Renounce_v1_1,
  SablierV2LockupLinear_v1_2_RenounceLockupStream_loader as Renounce_v1_2,
  SablierLockup_v2_0_RenounceLockupStream_loader as Renounce_v2_0,
  SablierV2LockupLinear_v1_0_Transfer_loader as Transfer_v1_0,
  SablierV2LockupLinear_v1_1_Transfer_loader as Transfer_v1_1,
  SablierV2LockupLinear_v1_2_Transfer_loader as Transfer_v1_2,
  SablierLockup_v2_0_Transfer_loader as Transfer_v2_0,
  SablierV2LockupLinear_v1_0_WithdrawFromLockupStream_loader as Withdraw_v1_0,
  SablierV2LockupLinear_v1_1_WithdrawFromLockupStream_loader as Withdraw_v1_1_to_v2_0,
} from "@envio-lockup/bindings/src/Types.gen";
import { Store } from "@envio-lockup/store";
import { Version } from "@sablier/deployments";

export namespace Loader {
  /* -------------------------------------------------------------------------- */
  /*                                    BASE                                    */
  /* -------------------------------------------------------------------------- */

  export type BaseReturn = {
    stream: Entity.Stream;
    watcher: Entity.Watcher;
  };

  type Base<T> = Approval_v1_0<T> &
    Approval_v1_1<T> &
    Approval_v1_2<T> &
    Approval_v2_0<T> &
    Cancel_v1_0<T> &
    Cancel_v1_1_to_v2_0<T> &
    Renounce_v1_0<T> &
    Renounce_v1_1<T> &
    Renounce_v1_2<T> &
    Renounce_v2_0<T> &
    Transfer_v1_0<T> &
    Transfer_v1_1<T> &
    Transfer_v1_2<T> &
    Transfer_v2_0<T> &
    Withdraw_v1_0<T> &
    Withdraw_v1_1_to_v2_0<T>;

  export const base: Base<BaseReturn> = async ({ context, event }): Promise<BaseReturn> => {
    let tokenId: bigint | undefined;
    if ("streamId" in event.params) {
      tokenId = event.params.streamId;
    } else if ("tokenId" in event.params) {
      tokenId = event.params.tokenId;
    } else {
      throw new Error("Neither tokenId nor streamId found in event params");
    }
    const stream = await Store.Stream.getOrThrow(context, event, tokenId);
    const watcher = await Store.Watcher.getOrThrow(context, event.chainId);
    return {
      stream,
      watcher,
    };
  };

  /* -------------------------------------------------------------------------- */
  /*                                   CREATE                                   */
  /* -------------------------------------------------------------------------- */

  export type CreateReturn = {
    asset: Entity.Asset | undefined;
    batch: Entity.Batch | undefined;
    batcher: Entity.Batcher | undefined;
    watcher: Entity.Watcher | undefined;
  };

  type EventParams = {
    asset: Address;
    sender: Address;
  };

  async function loaderForCreate(context: Context.Loader, event: Event, params: EventParams): Promise<CreateReturn> {
    const assetId = Id.asset(params.asset, event.chainId);
    const asset = await context.Asset.get(assetId);

    const batchId = Id.batch(event, params.sender);
    const batch = await context.Batch.get(batchId);

    const batcherId = Id.batcher(event.chainId, params.sender);
    const batcher = await context.Batcher.get(batcherId);

    const watcherId = event.chainId.toString();
    const watcher = await context.Watcher.get(watcherId);

    return {
      asset,
      batch,
      batcher,
      watcher,
    };
  }

  type CreateV1_0<T> = CreateDynamic_v1_0<T> & CreateLinear_v1_0<T>;
  const createV1_0: CreateV1_0<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, { asset: event.params.asset, sender: event.params.sender });
  };

  type CreateV1_1<T> = CreateDynamic_v1_1<T> & CreateLinear_v1_1<T>;
  const createV1_1: CreateV1_1<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, { asset: event.params.asset, sender: event.params.sender });
  };

  type CreateV1_2<T> = CreateDynamic_v1_2<T> & CreateLinear_v1_2<T> & CreateTranched_v1_2<T>;
  const createV1_2: CreateV1_2<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, { asset: event.params.asset, sender: event.params.sender });
  };

  type CreateV2_0<T> = CreateDynamic_v2_0<T> & CreateLinear_v2_0<T> & CreateTranched_v2_0<T>;
  const createV2_0: CreateV2_0<CreateReturn> = async ({ context, event }): Promise<CreateReturn> => {
    return loaderForCreate(context, event, {
      asset: event.params.commonParams[4],
      sender: event.params.commonParams[1],
    });
  };

  export const create = {
    [Version.Lockup.V1_0]: createV1_0,
    [Version.Lockup.V1_1]: createV1_1,
    [Version.Lockup.V1_2]: createV1_2,
    [Version.Lockup.V2_0]: createV2_0,
  };
}
