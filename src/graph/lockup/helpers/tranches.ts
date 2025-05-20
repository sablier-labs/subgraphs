import { BigInt } from "@graphprotocol/graph-ts";
import { StructTrancheV1_2, StructTrancheV2_0 } from "../bindings";
import { Tranche } from "./types";

export function convertTranchesV1_2(eventTranches: StructTrancheV1_2[]): Tranche[] {
  return convertTranches<StructTrancheV1_2>(
    eventTranches,
    (tranche) => tranche.amount,
    (tranche) => tranche.timestamp,
  );
}

export function convertTranchesV2_0(eventTranches: StructTrancheV2_0[]): Tranche[] {
  return convertTranches<StructTrancheV2_0>(
    eventTranches,
    (tranche) => tranche.amount,
    (tranche) => tranche.timestamp,
  );
}

function convertTranches<T>(
  eventTranches: T[],
  getAmount: (tranche: T) => BigInt,
  getTimestamp: (tranche: T) => BigInt,
): Tranche[] {
  const result: Tranche[] = [];

  for (let i = 0; i < eventTranches.length; i++) {
    const eventTranche = eventTranches[i];

    const amount = getAmount(eventTranche);
    const timestamp = getTimestamp(eventTranche);

    result.push(new Tranche(amount, timestamp));
  }

  return result;
}
