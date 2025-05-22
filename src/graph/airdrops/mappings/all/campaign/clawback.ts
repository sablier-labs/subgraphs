import { EventClawback } from "../../../bindings";
import { Params } from "../../../helpers/types";
import { Store } from "../../../store";

export function handleClawback(event: EventClawback): void {
  const campaign = Store.Campaign.get(event.address);
  if (campaign === null) {
    return;
  }

  /* --------------------------------- ACTION --------------------------------- */
  const action = Store.Action.create(event, campaign, {
    category: "Clawback",
    clawbackAmount: event.params.amount,
    clawbackFrom: event.params.admin,
    clawbackTo: event.params.to,
  } as Params.Action);

  /* -------------------------------- CAMPAIGN -------------------------------- */
  Store.Campaign.updateClawback(event, campaign, action.id);
}
