import { BigInt as BInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../constants";
import { EntityStream, EntityTranche, EventCreateTranched_V22 as EventCreateTranched } from "../bindings";

export class TrancheInput {
  amount: BInt;
  timestamp: BInt;

  constructor(amount: BInt, timestamp: BInt) {
    this.amount = amount;
    this.timestamp = timestamp;
  }
}

export function createTranche(id: string, streamed: BInt, last: TrancheInput, current: TrancheInput): EntityTranche {
  const tranche = new EntityTranche(id);
  tranche.amount = current.amount;
  tranche.timestamp = current.timestamp;

  tranche.startTime = last.timestamp;
  tranche.endTime = current.timestamp;

  tranche.startAmount = streamed;
  tranche.endAmount = streamed.plus(current.amount);

  return tranche;
}

export function createTranches(stream: EntityStream, event: EventCreateTranched): EntityStream {
  const tranches = event.params.tranches;

  let streamed = ZERO;
  const inputs: TrancheInput[] = [new TrancheInput(ZERO, stream.startTime)];

  for (let i = 0; i < tranches.length; i++) {
    const item = tranches[i];
    inputs.push(new TrancheInput(item.amount, item.timestamp));
  }

  for (let i = 1; i < inputs.length; i++) {
    const id = `${stream.id}-${i}`;
    const tranche: EntityTranche = createTranche(id, streamed, inputs[i - 1], inputs[i]);

    tranche.stream = stream.id;
    tranche.position = BInt.fromI32(i - 1);
    tranche.save();

    streamed = streamed.plus(inputs[i].amount);
  }

  return stream;
}
