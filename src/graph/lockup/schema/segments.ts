import { BigInt as BInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../constants";
import { EntitySegment, EntityStream, EventCreateDynamic_V20 as EventCreateDynamic } from "../bindings";

export class SegmentInput {
  amount: BInt;
  exponent: BInt;
  milestone: BInt;

  constructor(amount: BInt, exponent: BInt, milestone: BInt) {
    this.amount = amount;
    this.exponent = exponent;
    this.milestone = milestone;
  }
}

export function createSegment(id: string, streamed: BInt, last: SegmentInput, current: SegmentInput): EntitySegment {
  const segment = new EntitySegment(id);
  segment.amount = current.amount;
  segment.exponent = current.exponent;
  segment.milestone = current.milestone;

  segment.startTime = last.milestone;
  segment.endTime = current.milestone;

  segment.startAmount = streamed;
  segment.endAmount = streamed.plus(current.amount);

  return segment;
}

export function createSegments(stream: EntityStream, event: EventCreateDynamic): EntityStream {
  const segments = event.params.segments;

  let streamed = ZERO;
  const inputs: SegmentInput[] = [new SegmentInput(ZERO, ZERO, stream.startTime)];

  for (let i = 0; i < segments.length; i++) {
    const item = segments[i];
    inputs.push(new SegmentInput(item.amount, item.exponent, item.milestone));
  }

  for (let i = 1; i < inputs.length; i++) {
    const id = `${stream.id}-${i}`;
    const segment: EntitySegment = createSegment(id, streamed, inputs[i - 1], inputs[i]);

    segment.stream = stream.id;
    segment.position = BInt.fromI32(i - 1);
    segment.save();

    streamed = streamed.plus(inputs[i].amount);
  }

  return stream;
}
