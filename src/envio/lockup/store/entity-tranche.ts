import type { Tranche } from "@envio/lockup/helpers/types";
import type { Context, Entity } from "@envio-lockup/bindings";

export async function create(context: Context.Handler, stream: Entity.Stream, tranches: Tranche[]): Promise<void> {
  let streamedAmount = 0n;

  // The start time of the stream is the first tranche's start time
  let previous: Tranche = { amount: 0n, timestamp: stream.startTime };

  for (let i = 0; i < tranches.length; i++) {
    const current = tranches[i];
    const id = `${stream.id}-${i.toString()}`;
    const tranche: Entity.Tranche = {
      amount: current.amount,
      endAmount: streamedAmount + current.amount,
      endTime: current.timestamp,
      id,
      position: BigInt(i),
      startAmount: streamedAmount,
      startTime: previous.timestamp,
      stream_id: stream.id,
      timestamp: current.timestamp,
    };
    await context.Tranche.set(tranche);

    streamedAmount += tranche.endAmount;
    previous = current;
  }
}
