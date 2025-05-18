import { BigInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { EntitySegment, EntityStream } from "../bindings";
import { Segment } from "../params";

export function addSegments(stream: EntityStream, segments: Segment[]): EntityStream {
  let streamed = ZERO;

  // The start time of the stream is the first segment's start time
  let previous = new Segment(ZERO, ZERO, stream.startTime);

  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];

    const id = `${stream.id}-${i.toString()}`;
    const segment = new EntitySegment(id);
    segment.position = BigInt.fromI32(i);
    segment.stream = stream.id;

    segment.amount = current.amount;
    segment.exponent = current.exponent;
    segment.milestone = current.milestone;

    segment.startAmount = streamed;
    segment.startTime = previous.milestone;
    segment.endAmount = streamed.plus(current.amount);
    segment.endTime = current.milestone;

    segment.save();

    streamed = streamed.plus(current.amount);
    previous = current;
  }

  return stream;
}
