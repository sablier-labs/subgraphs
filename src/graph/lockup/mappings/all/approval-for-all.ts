/**
 * @file Common event handlers between all Lockup contracts.
 */
import { ONE, ZERO } from "../../../common/constants";
import { ActionParams } from "../../../common/params";
import { EventApprovalForAll } from "../../bindings";
import { createEntityAction } from "../../entities";

export function handleApprovalForAll(event: EventApprovalForAll): void {
  createEntityAction(event, {
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? ONE : ZERO,
    category: "ApprovalForAll",
  } as ActionParams);
}
