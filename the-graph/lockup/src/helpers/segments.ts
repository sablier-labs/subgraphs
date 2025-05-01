import { BigInt } from "@graphprotocol/graph-ts";
import { Segment, Stream } from "../generated/types/schema";
import { CreateLockupDynamicStream as EventCreateDynamic } from "../generated/types/templates/ContractLockupDynamic/SablierLockupDynamic";
import { zero } from "../constants";

export class SegmentInput {
  amount: BigInt;
  exponent: BigInt;
  milestone: BigInt;

  constructor(amount: BigInt, exponent: BigInt, milestone: BigInt) {
    this.amount = amount;
    this.exponent = exponent;
    this.milestone = milestone;
  }
}

export function createSegment(
  id: string,
  streamed: BigInt,
  last: SegmentInput,
  current: SegmentInput,
): Segment {
  let segment = new Segment(id);
  segment.amount = current.amount;
  segment.exponent = current.exponent;
  segment.milestone = current.milestone;

  segment.startTime = last.milestone;
  segment.endTime = current.milestone;

  segment.startAmount = streamed;
  segment.endAmount = streamed.plus(current.amount);

  return segment;
}

export function createSegments(
  stream: Stream,
  event: EventCreateDynamic,
): Stream {
  let segments = event.params.segments;

  let streamed = zero;
  let inputs: SegmentInput[] = [new SegmentInput(zero, zero, stream.startTime)];

  for (let i = 0; i < segments.length; i++) {
    let item = segments[i];
    inputs.push(new SegmentInput(item.amount, item.exponent, item.milestone));
  }

  for (let i = 1; i < inputs.length; i++) {
    let id = stream.id.concat("-").concat(i.toString());
    let segment: Segment = createSegment(
      id,
      streamed,
      inputs[i - 1],
      inputs[i],
    );

    segment.stream = stream.id;
    segment.position = BigInt.fromI32(i - 1);
    segment.save();

    streamed = streamed.plus(inputs[i].amount);
  }

  return stream;
}
