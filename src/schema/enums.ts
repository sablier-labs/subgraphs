/**
 * @file This is the source of truth for the enums in the GraphQL schemas, which are auto-generated from these enums.
 * Unfortunately, because AssemblyScript does not support enum strings, this cannot be used in the AssemblyScript mappings.
 * @see https://github.com/AssemblyScript/assemblyscript/issues/560
 * @see {@link file://./schema/airdrops.graphql}
 * @see {@link file://./schema/flow.graphql}
 * @see {@link file://./schema/lockup.graphql}
 */

export namespace Airdrops {
  export enum ActionCategory {
    Claim = "Claim",
    Clawback = "Clawback",
    Create = "Create",
    TransferAdmin = "TransferAdmin",
  }

  export enum CampaignCategory {
    Instant = "Instant",
    LockupLinear = "LockupLinear",
    LockupTranched = "LockupTranched",
  }
}

export namespace Flow {
  export enum ActionCategory {
    Approval = "Approval",
    ApprovalForAll = "ApprovalForAll",
    Adjust = "Adjust",
    Create = "Create",
    Deposit = "Deposit",
    Pause = "Pause",
    Refund = "Refund",
    Restart = "Restart",
    Transfer = "Transfer",
    Void = "Void",
    Withdraw = "Withdraw",
  }

  export enum StreamCategory {
    Flow = "Flow",
  }
}

export namespace Lockup {
  export enum ActionCategory {
    Approval = "Approval",
    ApprovalForAll = "ApprovalForAll",
    Cancel = "Cancel",
    Create = "Create",
    Renounce = "Renounce",
    Transfer = "Transfer",
    Withdraw = "Withdraw",
  }

  export enum StreamCategory {
    LockupDynamic = "LockupDynamic",
    LockupLinear = "LockupLinear",
    LockupTranched = "LockupTranched",
  }
}
