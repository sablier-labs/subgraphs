import type { Campaign, CreateTranchedArgs, Event, Tranche } from "../types";

class TrancheInput {
  percentage: bigint;
  duration: bigint;

  constructor(percentage: bigint, duration: bigint) {
    this.percentage = percentage;
    this.duration = duration;
  }
}

function createTranche(id: string, last: TrancheInput, current: TrancheInput) {
  const entity = {
    id,
    percentage: current.percentage,
    duration: current.duration,

    startDuration: last.duration,
    endDuration: BigInt(last.duration) + BigInt(current.duration),

    startPercentage: last.percentage,
    endPercentage: BigInt(last.percentage) + BigInt(current.percentage),
  } as const;

  return entity;
}

export function createTranches(event: Event<CreateTranchedArgs>, campaign: Pick<Campaign, "id">) {
  const params = event.params.tranchesWithPercentages;
  let last = new TrancheInput(0n, 0n);

  const tranches: Tranche[] = [];

  for (let i = 0; i < params.length; i++) {
    const id = campaign.id.concat("-").concat(i.toString());
    const current = new TrancheInput(params[i][0], params[i][1]);
    const tranche = {
      ...createTranche(id, last, current),
      campaign_id: campaign.id,
      position: BigInt(i),
    };

    tranches.push(tranche);

    last = current;
  }

  return tranches;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateTrancheId(streamId: string, index: number) {
  return "".concat(streamId).concat("-").concat(index.toString());
}
