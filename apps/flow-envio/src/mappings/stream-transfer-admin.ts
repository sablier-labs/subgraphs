import { FlowV10 } from "../../generated";
import type { TransferAdminHandler, TransferAdminLoader } from "../types";

import { generateContractIdFromEvent, initialize } from "../helpers";
import { ADDRESS_ZERO } from "../constants";

async function loader(input: TransferAdminLoader) {
  const { context, event } = input;
  const contractId = generateContractIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [contract, watcher] = await Promise.all([
    context.Contract.get(contractId),
    context.Watcher.get(watcherId),
  ]);

  return {
    contract,
    watcher,
  };
}

async function handler(input: TransferAdminHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /**
   * As described in issue #18, we will first filter out
   * any `Transfer` events emitted by the initial mint transaction
   */

  if (event.params.oldAdmin.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
    return;
  }

  /** ------- Initialize -------- */

  let { contract, contracts, watcher } = await initialize(
    event,
    context.Watcher.get,
    context.Contract.get,
    loaded,
  );

  /** ------- Process -------- */

  contract = {
    ...contract,
    admin: event.params.newAdmin,
  };

  if (contracts.length) {
    for (let i = 0; i < contracts.length; i++) {
      if (contracts[i].id === contract.id) {
        context.Contract.set(contract);
      }
      context.Contract.set(contracts[i]);
    }
  }

  context.Contract.set(contract);
  context.Watcher.set(watcher);
}

FlowV10.TransferAdmin.handlerWithLoader({
  loader,
  handler,
});
