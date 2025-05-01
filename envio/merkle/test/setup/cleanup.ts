import type { Vendor } from "./constants";

/**
 * The fields specifically mentioned by these types are most likely with issues.
 * Keep an eye on them.
 */

export type Activity = object & {
  id: string;
};

export type Asset = object & {
  id: string;
};

export type Factory = object & {
  id: string;
};

export type Action = object & {
  id: string;
  claimAmount: string | undefined;
  claimIndex: string | undefined;
  claimTokenId: string | undefined;
  clawbackAmount: string | undefined;
  campaign?: Campaign;
  from: string | undefined;
  subgraphId?: string | undefined;
};

export type Campaign = object & {
  asset: Asset;
  actions?: Action[];
  activities?: Activity[];
  factory: Factory;
  from: string | undefined;
  clawbackTime: string | undefined;
  subgraphId: string;
};

export type Campaigns = { campaigns: Campaign[] };
export type Actions = { actions: Action[] };
export type Metadata = { campaign: Campaign; actions: Action[] };

export const cleanup = {
  action: cleanup_action,
  actions: cleanup_actions,
  asset: cleanup_asset,
  campaign: cleanup_campaign,
  campaigns: cleanup_campaigns,
  factory: cleanup_factory,
  metadata: cleanup_metadata,
};

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

export function cleanup_factory(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Factory {
  const value = { ...(source as Factory) };

  if (skip) {
    return value;
  }

  if (vendor === "Envio") {
    /** Factory identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  return value;
}

export function cleanup_action(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Action {
  const value = { ...(source as Action) };

  if (skip) {
    return value;
  }

  // value.subgraphId = "SKIP";

  if (vendor === "Envio") {
    /** Action identifiers in Envio contain a -chainId suffix */
    value.id = value.id.substring(0, value.id.lastIndexOf("-"));
  }

  if (value.campaign) {
    value.campaign = cleanup_campaign(value.campaign, skip, vendor);
  }

  return value;
}

export function cleanup_actions(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Actions {
  const value = { ...(source as Actions) };

  if (skip) {
    return value;
  }

  value.actions = value.actions.map((action) =>
    cleanup_action(action, skip, vendor),
  );

  return value;
}

export function cleanup_campaign(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Campaign {
  const value = { ...(source as Campaign) };

  if (skip) {
    return value;
  }

  if (value.asset) {
    value.asset = cleanup_asset(value.asset, skip, vendor);
  }

  if (value.factory) {
    value.factory = cleanup_factory(value.factory, skip, vendor);
  }

  if (value.actions?.length) {
    value.actions = value.actions.map((action) =>
      cleanup_action(action, skip, vendor),
    );
  }

  return value;
}

export function cleanup_campaigns(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Campaigns {
  const value = { ...(source as Campaigns) };

  if (skip) {
    return value;
  }

  value.campaigns = value.campaigns.map((campaign) =>
    cleanup_campaign(campaign, skip, vendor),
  );

  return value;
}

export function cleanup_metadata(
  source: unknown,
  skip: boolean,
  vendor?: Vendor,
): Metadata {
  const value = { ...(source as Metadata) };

  if (skip) {
    return value;
  }

  return {
    campaign: cleanup_campaign(value.campaign, skip, vendor),
    actions: value.actions.map((action) =>
      cleanup_action(action, skip, vendor),
    ),
  };
}
