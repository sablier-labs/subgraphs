import { BigInt } from "@graphprotocol/graph-ts";
import { StructSegmentV1_0, StructSegmentV1_1, StructSegmentV1_2, StructSegmentV2_0 } from "../bindings";
import { Segment } from "../params";

export function convertSegmentsV1_0(segments: StructSegmentV1_0[]): Segment[] {
  return convertSegments<StructSegmentV1_0>(
    segments,
    (segment) => segment.amount,
    (segment) => segment.exponent,
    (segment) => segment.milestone,
  );
}

export function convertSegmentsV1_1(segments: StructSegmentV1_1[]): Segment[] {
  return convertSegments<StructSegmentV1_1>(
    segments,
    (segment) => segment.amount,
    (segment) => segment.exponent,
    (segment) => segment.milestone,
  );
}

/**
 * `milestone` was renamed to `timestamp` in v1.2
 * @see https://github.com/sablier-labs/lockup/releases/tag/v1.2.0
 */
export function convertSegmentsV1_2(segments: StructSegmentV1_2[]): Segment[] {
  return convertSegments<StructSegmentV1_2>(
    segments,
    (segment) => segment.amount,
    (segment) => segment.exponent,
    (segment) => segment.timestamp,
  );
}

export function convertSegmentsV2_0(segments: StructSegmentV2_0[]): Segment[] {
  return convertSegments<StructSegmentV2_0>(
    segments,
    (segment) => segment.amount,
    (segment) => segment.exponent,
    (segment) => segment.timestamp,
  );
}

function convertSegments<T>(
  segments: T[],
  getAmount: (segment: T) => BigInt,
  getExponent: (segment: T) => BigInt,
  getMilestone: (segment: T) => BigInt,
): Segment[] {
  const result: Segment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    const amount = getAmount(segment);
    const exponent = getExponent(segment);
    const milestone = getMilestone(segment);

    result.push(new Segment(amount, exponent, milestone));
  }

  return result;
}
