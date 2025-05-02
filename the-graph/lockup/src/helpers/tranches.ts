import { BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import { zero } from "../constants";
import { type Stream, Tranche } from "../generated/types/schema";
import type { CreateLockupTranchedStream as EventCreateTranched } from "../generated/types/templates/ContractLockupTranched/SablierLockupTranched";

export class TrancheInput {
  amount: GraphBigInt;
  timestamp: GraphBigInt;

  constructor(amount: GraphBigInt, timestamp: GraphBigInt) {
    this.amount = amount;
    this.timestamp = timestamp;
  }
}

export function createTranche(id: string, streamed: GraphBigInt, last: TrancheInput, current: TrancheInput): Tranche {
  const tranche = new Tranche(id);
  tranche.amount = current.amount;
  tranche.timestamp = current.timestamp;

  tranche.startTime = last.timestamp;
  tranche.endTime = current.timestamp;

  tranche.startAmount = streamed;
  tranche.endAmount = streamed.plus(current.amount);

  return tranche;
}

export function createTranches(stream: Stream, event: EventCreateTranched): Stream {
  const tranches = event.params.tranches;

  let streamed = zero;
  const inputs: TrancheInput[] = [new TrancheInput(zero, stream.startTime)];

  for (let i = 0; i < tranches.length; i++) {
    const item = tranches[i];
    inputs.push(new TrancheInput(item.amount, item.timestamp));
  }

  for (let i = 1; i < inputs.length; i++) {
    const id = stream.id.concat("-").concat(i.toString());
    const tranche: Tranche = createTranche(id, streamed, inputs[i - 1], inputs[i]);

    tranche.stream = stream.id;
    tranche.position = GraphBigInt.fromI32(i - 1);
    tranche.save();

    streamed = streamed.plus(inputs[i].amount);
  }

  return stream;
}
