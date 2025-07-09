import { gql } from "graphql-request";
import { AssetFragment } from "../common";

// Re-export common fragments for query access
export { AssetFragment };

// ─────────────────────────────────────────────────────────────
// SHARED FRAGMENTS (used by both Envio and TheGraph)
// ─────────────────────────────────────────────────────────────

export const ActionFragment = gql /* GraphQL */`
  fragment ActionFragment on Action {
    id
    chainId
    subgraphId
    campaign {
      id
    }
    category
    hash
    block
    timestamp
    from

    claimStreamId
    claimTokenId
    claimAmount
    claimIndex
    claimRecipient

    clawbackAmount
    clawbackFrom
    clawbackTo
  }
`;

export const FactoryFragment = gql /* GraphQL */`
  fragment FactoryFragment on Factory {
    id
    alias
    address
  }
`;

export const ActivityFragment = gql /* GraphQL */`
  fragment ActivityFragment on Activity {
    id
    timestamp
    day
    amount
    claims
    campaign {
      id
    }
  }
`;

export const TrancheFragment = gql /* GraphQL */`
  fragment TrancheFragment on Tranche {
    id
    position
    percentage
    duration
    startPercentage
    endPercentage
    endDuration
    startDuration
  }
`;

// ─────────────────────────────────────────────────────────────
// SYNTAX-SPECIFIC FRAGMENTS
// ─────────────────────────────────────────────────────────────

export const CampaignFragment_Envio = gql /* GraphQL */`
  fragment CampaignFragment on Campaign {
    id
    subgraphId
    address
    chainId
    category
    hash
    timestamp
    admin
    lockup
    root
    expires
    expiration
    ipfsCID
    aggregateAmount
    totalRecipients
    clawbackTime
    streamCliff
    streamCliffDuration
    streamTotalDuration
    streamCancelable
    streamTransferable
    claimedAmount
    claimedCount
    version
    asset {
      ...AssetFragment
    }
    factory {
      ...FactoryFragment
    }
    actions(order_by: { subgraphId: asc }, limit: 1000) {
      ...ActionFragment
    }
    activities(order_by: { timestamp: desc }, limit: 1000) {
      ...ActivityFragment
    }
    streamTranches(order_by: { position: desc }, limit: 100) {
      ...TrancheFragment
    }
  }
`;

export const CampaignFragment_TheGraph = gql /* GraphQL */`
  fragment CampaignFragment on Campaign {
    id
    subgraphId
    address
    chainId
    category
    hash
    timestamp
    admin
    lockup
    root
    expires
    expiration
    ipfsCID
    aggregateAmount
    totalRecipients
    clawbackTime
    streamCliff
    streamCliffDuration
    streamTotalDuration
    streamCancelable
    streamTransferable
    claimedAmount
    claimedCount
    version
    asset {
      ...AssetFragment
    }
    factory {
      ...FactoryFragment
    }
    actions(orderBy: subgraphId, orderDirection: asc, first: 1000) {
      ...ActionFragment
    }
    activities(orderBy: timestamp, orderDirection: desc, first: 1000) {
      ...ActivityFragment
    }
    streamTranches(orderBy: position, orderDirection: desc, first: 100) {
      ...TrancheFragment
    }
  }
`;
