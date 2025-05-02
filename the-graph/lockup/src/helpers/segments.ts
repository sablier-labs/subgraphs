import { BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import { zero } from "../constants";
import { Segment, type Stream } from "../generated/types/schema";
import type { CreateLockupDynamicStream as EventCreateDynamic } from "../generated/types/templates/ContractLockupDynamic/SablierLockupDynamic";

export class SegmentInput {
  amount: GraphBigInt;
  exponent: GraphBigInt;
  milestone: GraphBigInt;

  constructor(amount: GraphBigInt, exponent: GraphBigInt, milestone: GraphBigInt) {
    this.amount = amount;
    this.exponent = exponent;
    this.milestone = milestone;
  }
}

export function createSegment(id: string, streamed: GraphBigInt, last: SegmentInput, current: SegmentInput): Segment {
  const segment = new Segment(id);
  segment.amount = current.amount;
  segment.exponent = current.exponent;
  segment.milestone = current.milestone;

  segment.startTime = last.milestone;
  segment.endTime = current.milestone;

  segment.startAmount = streamed;
  segment.endAmount = streamed.plus(current.amount);

  return segment;
}

export function createSegments(stream: Stream, event: EventCreateDynamic): Stream {
  const segments = event.params.segments;

  let streamed = zero;
  const inputs: SegmentInput[] = [new SegmentInput(zero, zero, stream.startTime)];

  for (let i = 0; i < segments.length; i++) {
    const item = segments[i];
    inputs.push(new SegmentInput(item.amount, item.exponent, item.milestone));
  }

  for (let i = 1; i < inputs.length; i++) {
    const id = stream.id.concat("-").concat(i.toString());
    const segment: Segment = createSegment(id, streamed, inputs[i - 1], inputs[i]);

    segment.stream = stream.id;
    segment.position = GraphBigInt.fromI32(i - 1);
    segment.save();

    streamed = streamed.plus(inputs[i].amount);
  }

  return stream;
}
