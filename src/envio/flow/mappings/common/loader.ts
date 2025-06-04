/**
 * @file Reusable Envio loaders
 * @see https://docs.envio.dev/docs/HyperIndex/loaders
 */
import type { Entity } from "../../bindings";
import type {
  SablierFlow_v1_0_AdjustFlowStream_loader as Adjust_All,
  SablierFlow_v1_0_Approval_loader as Approval_All,
  SablierFlow_v1_0_DepositFlowStream_loader as Deposit_All,
  SablierFlow_v1_0_PauseFlowStream_loader as Pause_All,
  SablierFlow_v1_0_RefundFromFlowStream_loader as Refund_All,
  SablierFlow_v1_0_RestartFlowStream_loader as Restart_All,
  SablierFlow_v1_0_Transfer_loader as Transfer_All,
  SablierFlow_v1_0_VoidFlowStream_loader as Void_All,
  SablierFlow_v1_0_WithdrawFromFlowStream_loader as Withdraw_v1_0,
  SablierFlow_v1_1_WithdrawFromFlowStream_loader as Withdraw_v1_1_to_v2_0,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";

export namespace Loader {
  export type BaseReturn = {
    stream: Entity.Stream;
    watcher: Entity.Watcher;
  };

  type Base<T> = Adjust_All<T> &
    Approval_All<T> &
    Deposit_All<T> &
    Pause_All<T> &
    Refund_All<T> &
    Restart_All<T> &
    Transfer_All<T> &
    Void_All<T> &
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
}
