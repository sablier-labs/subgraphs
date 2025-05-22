import type { Context, Entity } from "@envio-lockup/bindings";
import type { Segment } from "@envio-lockup/helpers/types";

export async function create(context: Context.Handler, stream: Entity.Stream, segments: Segment[]): Promise<void> {
  let streamed = 0n;

  // The start time of the stream is the first segment's start time
  let previous: Segment = { amount: 0n, exponent: 0n, milestone: stream.startTime };

  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];

    const id = `${stream.id}-${i.toString()}`;
    const segment: Entity.Segment = {
      amount: current.amount,
      endAmount: streamed + current.amount,
      endTime: current.milestone,
      exponent: current.exponent,
      id,
      milestone: current.milestone,
      position: BigInt(i),
      startAmount: streamed,
      startTime: previous.milestone,
      stream_id: stream.id,
    };
    await context.Segment.set(segment);

    streamed += current.amount;
    previous = current;
  }
}
