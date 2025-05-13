import { BigInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { EntitySegment, EntityStream } from "../bindings";
import { Segment } from "../params";

export function addSegments(stream: EntityStream, segments: Segment[]): EntityStream {
  let streamed = ZERO;

  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const last = segments[i - 1];

    const id = stream.id + "-" + i.toString();
    const segment = new EntitySegment(id);

    segment.amount = current.amount;
    segment.exponent = current.exponent;
    segment.milestone = current.milestone;

    segment.startAmount = streamed;
    segment.startTime = last.milestone;
    segment.endAmount = streamed.plus(current.amount);
    segment.endTime = current.milestone;

    segment.stream = stream.id;
    segment.position = BigInt.fromI32(i - 1);
    segment.save();

    streamed = streamed.plus(current.amount);
  }

  return stream;
}
