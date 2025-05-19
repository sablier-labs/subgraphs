import { BigInt } from "@graphprotocol/graph-ts";
import { StructTrancheV1_2, StructTrancheV2_0 } from "../bindings";
import { Tranche } from "./params";

export function convertTranchesV1_2(tranches: StructTrancheV1_2[]): Tranche[] {
  return convertTranches<StructTrancheV1_2>(
    tranches,
    (tranche) => tranche.amount,
    (tranche) => tranche.timestamp,
  );
}

export function convertTranchesV2_0(tranches: StructTrancheV2_0[]): Tranche[] {
  return convertTranches<StructTrancheV2_0>(
    tranches,
    (tranche) => tranche.amount,
    (tranche) => tranche.timestamp,
  );
}

function convertTranches<T>(
  tranches: T[],
  getAmount: (tranche: T) => BigInt,
  getTimestamp: (tranche: T) => BigInt,
): Tranche[] {
  const result: Tranche[] = [];

  for (let i = 0; i < tranches.length; i++) {
    const tranche = tranches[i];

    const amount = getAmount(tranche);
    const timestamp = getTimestamp(tranche);

    result.push(new Tranche(amount, timestamp));
  }

  return result;
}
