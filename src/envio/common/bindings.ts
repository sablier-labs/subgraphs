/**
 * @file Generic bindings needed because Envio doesn't export them.
 * @see https://github.com/enviodev/hyperindex/issues/532
 */
import type { t as Address_t } from "envio/src/Address.gen";
import type { genericEvent as Internal_genericEvent } from "envio/src/Internal.gen";

export type Address = Address_t;

export type AggregatedBlock_t = {
  readonly timestamp: number;
  readonly hash: string;
  readonly number: number;
};

export type AggregatedTransaction_t = {
  readonly to: undefined | Address_t;
  readonly hash: string;
  readonly transactionIndex: number;
  readonly value: bigint;
  readonly from: undefined | Address_t;
};

export type Block_t = {
  readonly number: number;
  readonly timestamp: number;
  readonly hash: string;
};

export type eventLog<params> = Internal_genericEvent<params, Block_t, Transaction_t>;
export type EventLog<params> = eventLog<params>;
export type Event<Params extends object = Record<string, unknown>> = EventLog<Params>;

export type Transaction_t = {
  readonly from: undefined | Address_t;
  readonly hash: string;
  readonly to: undefined | Address_t;
  readonly transactionIndex: number;
  readonly value: bigint;
};
