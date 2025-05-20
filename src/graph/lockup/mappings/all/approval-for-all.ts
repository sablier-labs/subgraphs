import { ONE, ZERO } from "../../../common/constants";
import { ActionParams } from "../../../common/types";
import { EventApprovalForAll } from "../../bindings";
import { Store } from "../../store";

export function handleApprovalForAll(event: EventApprovalForAll): void {
  Store.Action.create(event, {
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? ONE : ZERO,
    category: "ApprovalForAll",
  } as ActionParams);
}
