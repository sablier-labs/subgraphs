/**
 * @file Reusable Envio loaders
 * @see https://docs.envio.dev/docs/HyperIndex/loaders
 */
import type { Entity } from "../../bindings";
import type {
  SablierFlow_v1_0_AdjustFlowStream_loader as Adjust_v1_0,
  SablierFlow_v1_1_AdjustFlowStream_loader as Adjust_v1_1,
  SablierFlow_v1_0_Approval_loader as Approval_v1_0,
  SablierFlow_v1_1_Approval_loader as Approval_v1_1,
  SablierFlow_v1_0_DepositFlowStream_loader as Deposit_v1_0,
  SablierFlow_v1_1_DepositFlowStream_loader as Deposit_v1_1,
  SablierFlow_v1_0_PauseFlowStream_loader as Pause_v1_0,
  SablierFlow_v1_1_PauseFlowStream_loader as Pause_v1_1,
  SablierFlow_v1_0_RefundFromFlowStream_loader as Refund_v1_0,
  SablierFlow_v1_1_RefundFromFlowStream_loader as Refund_v1_1,
  SablierFlow_v1_0_RestartFlowStream_loader as Restart_v1_0,
  SablierFlow_v1_1_RestartFlowStream_loader as Restart_v1_1,
  SablierFlow_v1_0_Transfer_loader as Transfer_v1_0,
  SablierFlow_v1_1_Transfer_loader as Transfer_v1_1,
  SablierFlow_v1_0_VoidFlowStream_loader as Void_v1_0,
  SablierFlow_v1_1_VoidFlowStream_loader as Void_v1_1,
  SablierFlow_v1_0_WithdrawFromFlowStream_loader as Withdraw_v1_0,
  SablierFlow_v1_1_WithdrawFromFlowStream_loader as Withdraw_v1_1,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";

export namespace Loader {
  type Base<T> = Adjust_v1_0<T> &
    Adjust_v1_1<T> &
    Approval_v1_0<T> &
    Approval_v1_1<T> &
    Deposit_v1_0<T> &
    Deposit_v1_1<T> &
    Pause_v1_0<T> &
    Pause_v1_1<T> &
    Refund_v1_0<T> &
    Refund_v1_1<T> &
    Restart_v1_0<T> &
    Restart_v1_1<T> &
    Transfer_v1_0<T> &
    Transfer_v1_1<T> &
    Void_v1_0<T> &
    Void_v1_1<T> &
    Withdraw_v1_0<T> &
    Withdraw_v1_1<T>;

  export type BaseReturn = {
    stream?: Entity.Stream;
    watcher?: Entity.Watcher;
  };

  export const base: Base<BaseReturn> = async ({ context, event }): Promise<BaseReturn> => {
    let tokenId: bigint | undefined;
    if ("streamId" in event.params) {
      tokenId = event.params.streamId;
    } else if ("tokenId" in event.params) {
      tokenId = event.params.tokenId;
    } else {
      throw new Error("Neither tokenId nor streamId found in event params");
    }
    const stream = await Store.Stream.get(context, event, tokenId);
    const watcher = await Store.Watcher.get(context, event.chainId);
    return {
      stream,
      watcher,
    };
  };
}
