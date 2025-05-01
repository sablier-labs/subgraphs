import type {
  CreateTranchedArgs,
  CreateTranchedMergedArgs,
  Event,
  Mutable,
  Stream,
  Tranche,
} from "../types";

type Entity = Partial<Mutable<Tranche>>;

class TrancheInput {
  amount: bigint;
  timestamp: bigint;

  constructor(amount: bigint, timestamp: bigint) {
    this.amount = amount;
    this.timestamp = timestamp;
  }
}

function createTranche(
  id: string,
  streamed: bigint,
  last: TrancheInput,
  current: TrancheInput,
) {
  const entity = {
    id,
    amount: current.amount,
    timestamp: current.timestamp,

    startTime: last.timestamp,
    endTime: current.timestamp,

    startAmount: streamed,
    endAmount: BigInt(streamed) + BigInt(current.amount),
  } satisfies Entity;

  return entity;
}

export function createTranches(
  event: Event<CreateTranchedArgs | CreateTranchedMergedArgs>,
  stream: Pick<Stream, "id" | "startTime">,
) {
  let streamed = 0n;
  const inputs: TrancheInput[] = [new TrancheInput(0n, stream.startTime)];

  event.params.tranches.forEach((item) => {
    inputs.push(new TrancheInput(BigInt(item[0]), BigInt(item[1])));
  });

  const tranches: Tranche[] = [];

  for (let i = 1; i < inputs.length; i++) {
    const id = generateTrancheId(stream.id, i);
    const entity = createTranche(id, streamed, inputs[i - 1], inputs[i]);

    const tranche: Tranche = {
      ...entity,
      stream_id: stream.id,
      position: BigInt(i - 1),
    };

    tranches.push(tranche);
    streamed = BigInt(streamed) + BigInt(inputs[i].amount);
  }

  return tranches;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateTrancheId(streamId: string, index: number) {
  return "".concat(streamId).concat("-").concat(index.toString());
}
