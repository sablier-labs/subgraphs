import { BigInt as BInt } from "@graphprotocol/graph-ts";
import { StructTrancheV1_2, StructTrancheV2_0 } from "../bindings";
import { Tranche } from "../params";

export function convertTranchesV1_2(tranches: Array<StructTrancheV1_2>): Array<Tranche> {
  return convertTranches<StructTrancheV1_2>(
    tranches,
    (tranche) => tranche.amount,
    (tranche) => tranche.timestamp,
  );
}

export function convertTranchesV2_0(tranches: Array<StructTrancheV2_0>): Array<Tranche> {
  return convertTranches<StructTrancheV2_0>(
    tranches,
    (tranche) => tranche.amount,
    (tranche) => tranche.timestamp,
  );
}

function convertTranches<T>(
  segments: Array<T>,
  getAmount: (segment: T) => BInt,
  getTimestamp: (segment: T) => BInt,
): Array<Tranche> {
  const result: Tranche[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    const amount = getAmount(segment);
    const timestamp = getTimestamp(segment);

    result.push(new Tranche(amount, timestamp));
  }

  return result;
}
