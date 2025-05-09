import { BigInt as BInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../constants";
import { EntityStream, EntityTranche } from "../bindings";
import { Tranche } from "../params";

export function addTranches(stream: EntityStream, tranches: Array<Tranche>): EntityStream {
  let streamedAmount = ZERO;

  // The start time of the stream is the first tranche's start time
  let previous = new Tranche(ZERO, stream.startTime);

  for (let i = 0; i < tranches.length; i++) {
    const current = tranches[i];

    const id = stream.id + "-" + i.toString();
    const tranche = new EntityTranche(id);

    tranche.amount = current.amount;
    tranche.timestamp = current.timestamp;

    tranche.endAmount = streamedAmount.plus(current.amount);
    tranche.endTime = current.timestamp;
    tranche.startAmount = streamedAmount;
    tranche.startTime = previous.timestamp;

    tranche.stream = stream.id;
    tranche.position = BInt.fromI32(i);
    tranche.save();

    streamedAmount = streamedAmount.plus(tranche.endAmount);
    previous = tranches[i];
  }

  return stream;
}
