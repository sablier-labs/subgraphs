import type { Vendor } from "./constants";

/**
 * The fields specifically mentioned by these types are most likely with issues.
 * Keep an eye on them.
 */

export type Action = object & {
  id: string;
  contract?: Contract;
  addressA: string | undefined;
  from: string | undefined;
};

export type Asset = object & {
  id: string;
};

export type Batch = object & {
  id: string;
};

export type Batcher = object & {
  id: string;
};

export type Contract = object & {
  id: string;
};

export type Stream = object & {
  id: string;
  category: string;
  subgraphId: string;
  alias?: string;
  asset?: Asset;
  batch?: Batch;
  contract?: Contract;
  from: string | undefined;
  actions?: Action[];
  segments?: (object & { id: string; position: string | number })[];
};

export type Streams = { streams: Stream[] };

export const cleanup = {
  action: cleanup_action,
  asset: cleanup_asset,
  batch: cleanup_batch,
  batcher: cleanup_batcher,
  stream: cleanup_stream,
  streams: cleanup_streams,
};

export function cleanup_action(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Action {
  const value = { ...(source as Action) };

  if (skip) {
    return value;
  }

  if (vendor === "Envio") {
    /** Action identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  if (value.contract) {
    value.contract = cleanup_contract(value.contract, skip, vendor);
  }

  return value;
}

export function cleanup_asset(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Asset {
  const value = { ...(source as Asset) };

  if (skip) {
    return value;
  }

  if (vendor === "Envio") {
    /** Asset identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  return value;
}

export function cleanup_batch(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Batch {
  const value = { ...(source as Batch) };

  if (skip) {
    return value;
  }

  if (vendor === "Envio") {
    /** Batch identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  return value;
}

export function cleanup_batcher(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Batcher {
  const value = { ...(source as Batcher) };

  if (skip) {
    return value;
  }

  if (vendor === "Envio") {
    /** Batcher identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  return value;
}

export function cleanup_contract(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Contract {
  const value = { ...(source as Contract) };

  if (skip) {
    return value;
  }

  if (vendor === "Envio") {
    /** Contract identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  return value;
}

export function cleanup_stream(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Stream {
  const value = { ...(source as Stream) };

  if (skip) {
    return value;
  }

  if (value.asset) {
    value.asset = cleanup_contract(value.asset, skip, vendor);
  }

  if (value.batch) {
    value.batch = cleanup_contract(value.batch, skip, vendor);
  }

  if (value.contract) {
    value.contract = cleanup_contract(value.contract, skip, vendor);
  }

  if (value.segments) {
    /** Segments should be re-ordered */
    value.segments = value.segments.sort((a, b) =>
      String(a.position).localeCompare(String(b.position)),
    );
  }

  if (value.actions?.length) {
    value.actions = value.actions.map((action) =>
      cleanup_action(action, skip, vendor),
    );
  }

  return value;
}

export function cleanup_streams(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Streams {
  const value = { ...(source as Streams) };

  if (skip) {
    return value;
  }

  value.streams = value.streams.map((stream) =>
    cleanup_stream(stream, skip, vendor),
  );

  return value;
}
