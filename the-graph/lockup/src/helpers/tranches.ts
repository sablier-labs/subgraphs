import { BigInt } from "@graphprotocol/graph-ts";
import { Stream, Tranche } from "../generated/types/schema";
import { CreateLockupTranchedStream as EventCreateTranched } from "../generated/types/templates/ContractLockupTranched/SablierLockupTranched";
import { zero } from "../constants";

export class TrancheInput {
  amount: BigInt;
  timestamp: BigInt;

  constructor(amount: BigInt, timestamp: BigInt) {
    this.amount = amount;
    this.timestamp = timestamp;
  }
}

export function createTranche(
  id: string,
  streamed: BigInt,
  last: TrancheInput,
  current: TrancheInput,
): Tranche {
  let tranche = new Tranche(id);
  tranche.amount = current.amount;
  tranche.timestamp = current.timestamp;

  tranche.startTime = last.timestamp;
  tranche.endTime = current.timestamp;

  tranche.startAmount = streamed;
  tranche.endAmount = streamed.plus(current.amount);

  return tranche;
}

export function createTranches(
  stream: Stream,
  event: EventCreateTranched,
): Stream {
  let tranches = event.params.tranches;

  let streamed = zero;
  let inputs: TrancheInput[] = [new TrancheInput(zero, stream.startTime)];

  for (let i = 0; i < tranches.length; i++) {
    let item = tranches[i];
    inputs.push(new TrancheInput(item.amount, item.timestamp));
  }

  for (let i = 1; i < inputs.length; i++) {
    let id = stream.id.concat("-").concat(i.toString());
    let tranche: Tranche = createTranche(
      id,
      streamed,
      inputs[i - 1],
      inputs[i],
    );

    tranche.stream = stream.id;
    tranche.position = BigInt.fromI32(i - 1);
    tranche.save();

    streamed = streamed.plus(inputs[i].amount);
  }

  return stream;
}
