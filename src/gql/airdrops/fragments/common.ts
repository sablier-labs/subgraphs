export namespace Common {
  export const ActionFragment = /* GraphQL */ `
    fragment ActionFragment on Action {
      id
      category
      chainId
      claimAmount
      claimIndex
      claimRecipient
      claimStreamId
      claimTokenId
      clawbackAmount
      clawbackFrom
      clawbackTo
      fee
      from
      hash
      subgraphId
      timestamp
      campaign {
        id
        name
        nickname
      }
    }
  `;

  export const ActivityFragment = /* GraphQL */ `
    fragment ActivityFragment on Activity {
      id
      amount
      claims
      day
      timestamp
      campaign {
        id
      }
    }
  `;

  export const FactoryFragment = /* GraphQL */ `
    fragment FactoryFragment on Factory {
      id
      address
      alias
      version
    }
  `;

  export const TrancheFragment = /* GraphQL */ `
    fragment TrancheFragment on Tranche {
      id
      duration
      endDuration
      endPercentage
      percentage
      position
      startDuration
      startPercentage
    }
  `;

  export const getCampaignFragment = (firstArg: "first" | "limit"): string => {
    return /* GraphQL */ `
      fragment CampaignFragment on Campaign {
        id
        address
        admin
        aggregateAmount
        category
        chainId
        claimedAmount
        claimedCount
        clawbackTime
        expiration
        expires
        fee
        hash
        ipfsCID
        lockup
        name
        nickname
        root
        streamCancelable
        streamCliff
        streamCliffDuration
        streamCliffPercentage
        streamInitial
        streamInitialPercentage
        streamShape
        streamStart
        streamStartTime
        streamTotalDuration
        streamTransferable
        subgraphId
        timestamp
        totalRecipients
        version
        asset {
          ...AssetFragment
        }
        factory {
          ...FactoryFragment
        }
        streamTranches(${firstArg}: 1000) {
          ...TrancheFragment
        }
      }
    `;
  };
}
