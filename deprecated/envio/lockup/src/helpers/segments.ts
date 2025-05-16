import type { CreateDynamicArgs, CreateDynamicMergedArgs, Event, Mutable, Segment, Stream } from "../types";

type Entity = Partial<Mutable<Segment>>;

class SegmentInput {
  amount: bigint;
  exponent: bigint;
  milestone: bigint;

  constructor(amount: bigint, exponent: bigint, milestone: bigint) {
    this.amount = amount;
    this.exponent = exponent;
    this.milestone = milestone;
  }
}

function createSegment(id: string, streamed: bigint, last: SegmentInput, current: SegmentInput) {
  const entity = {
    id,
    amount: current.amount,
    exponent: current.exponent,
    milestone: current.milestone,

    startTime: last.milestone,
    endTime: current.milestone,

    startAmount: streamed,
    endAmount: BigInt(streamed) + BigInt(current.amount),
  } satisfies Entity;

  return entity;
}

export function createSegments(
  event: Event<CreateDynamicArgs | CreateDynamicMergedArgs>,
  stream: Pick<Stream, "id" | "startTime">,
) {
  let streamed = 0n;
  const inputs: SegmentInput[] = [new SegmentInput(0n, 0n, stream.startTime)];

  for (const item of event.params.segments) {
    inputs.push(new SegmentInput(BigInt(item[0]), BigInt(item[1]), BigInt(item[2])));
  }

  const segments: Segment[] = [];

  for (let i = 1; i < inputs.length; i++) {
    const id = generateSegmentId(stream.id, i);
    const entity = createSegment(id, streamed, inputs[i - 1], inputs[i]);

    const segment: Segment = {
      ...entity,
      stream_id: stream.id,
      position: BigInt(i - 1),
    };

    segments.push(segment);
    streamed = BigInt(streamed) + BigInt(inputs[i].amount);
  }

  return segments;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateSegmentId(streamId: string, index: number) {
  return "".concat(streamId).concat("-").concat(index.toString());
}
