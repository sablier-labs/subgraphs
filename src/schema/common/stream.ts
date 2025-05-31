import type { Indexed } from "@src/types";
import { gql } from "graphql-tag";

const commonDefs = `#graphql
  # ------------------------------------ IDs ----------------------------------- #
  """
  Unique identifier: {contractAddress}-{chainId}-{tokenId}
  """
  id: String!

  """
  Like the id: {contractAlias}-{chainId}-{tokenId}
  """
  alias: String!

  """
  The id of the chain, e.g., 137 for Polygon.
  """
  chainId: BigInt!

  """
  Unique global id as tracked by the \`Watcher\` entity.
  🚨 This may change if new data sources are added and the chronological order of streams changes.
  """
  subgraphId: BigInt!

  """
  The id provided by the Lockup contract. This is the ERC-721 tokenId.
  """
  tokenId: BigInt!

  # ------------------------------- TRANSACTION ------------------------------ #
  """
  Hash of the Ethereum transaction that created this stream.
  """
  hash: Bytes!

  """
  Unix timestamp of the Ethereum transaction that created this stream.
  """
  timestamp: BigInt!

  # --------------------------------- ACTIONS -------------------------------- #
  """
  Actions triggered by this stream.
  """
  actions: [Action!]! @derivedFrom(field: "stream")

  # --------------------------------- COMMON --------------------------------- #
  """
  ERC-20 token distributed via this stream.
  """
  asset: Asset!

  """
  ERC-20 token decimals. Stored here to avoid loading the asset entity on each stream.
  """
  assetDecimals: BigInt!

  """
  The batch the stream may be part of.
  Note: this is available only when created within a batch create transaction.
  """
  batch: Batch!

  """
  Category used for sorting.
  """
  category: StreamCategory!

  """
  The contract the stream originates from.
  """
  contract: Bytes!

  """
  Position in the batch, if available.
  """
  position: BigInt!

  """
  Current recipient of the stream, with permission to withdraw funds to any third-party address.
  Note: the recipient can change on NFT transfer.
  """
  recipient: Bytes!

  """
  Manager of the stream, with ability to cancel the stream.
  """
  sender: Bytes!

  """
  Unix timestamp for the start of the stream.
  """
  startTime: BigInt!

  """
  Flag indicating the transferability of the stream. This is set when the stream is created, and cannot
  be changed later.
  """
  transferable: Boolean!

  """
  Version of contract, e.g., v1.0.
  """
  version: String!

  """
  The sum of all withdrawn amounts.
  """
  withdrawnAmount: BigInt!
`;

const lockupDefs = gql`
  type Stream @entity(immutable: false) {
    ${commonDefs}

    # --------------------------------- LOCKUP --------------------------------- #
    """
    Action in which the stream was canceled.
    """
    canceledAction: Action

    """
    Action in which the stream was made non-cancelable.
    Note: if the stream was made non-cancelable from the get-go, this is the same as the Create action.
    """
    renounceAction: Action

    """
    Flag indicating the cancelability of the stream.
    """
    cancelable: Boolean!

    """
    Flag indicating if the stream was canceled.
    """
    canceled: Boolean!

    """
    Unix timestamp for the when the stream was canceled.
    """
    canceledTime: BigInt

    """
    The amount deposited when the stream was created.
    """
    depositAmount: BigInt!

    """
    Snapshot of the duration in seconds (the difference between end and start time).
    """
    duration: BigInt!

    """
    Unix timestamp for the end of the stream.
    """
    endTime: BigInt!

    """
    The account that funded the stream, which can be different from the sender.
    """
    funder: Bytes!

    """
    The amount that is still held by the stream regardless of whether if was fully vested or not.
    This is the difference between the deposit amount and all withdrawn amounts.
    """
    intactAmount: BigInt!

    """
    Users associated with the stream: recipient, sender, possibly the sender's proxy.
    """
    parties: [Bytes!]!

    """
    Owner of the proxy when the stream is created through a PRBProxy (https://github.com/PaulRBerg/prb-proxy)
    Note that proxy = stream sender, and proxender = owner of proxy
    """
    proxender: Bytes

    """
    Flag for streams created through a PRBProxy.
    """
    proxied: Boolean!

    """
    Unix timestamp for when the stream was made non-cancelable. This can coincide with the create time.
    """
    renounceTime: BigInt

    """
    An optional parameter to specify the shape of the distribution.
    Available since Lockup v2.0.
    """
    shape: String

    # ------------------------------ LOCKUP-LINEAR ----------------------------- #
    """
    Flag for Linear streams with a cliff.
    """
    cliff: Boolean!

    """
    The amount that will unlock at the cliff time.
    """
    cliffAmount: BigInt

    """
    Unix timestamp for the start of the cliff.
    """
    cliffTime: BigInt

    """
    Flag for Linear stream with an initial unlock.
    Available since Lockup v2.0.
    """
    initial: Boolean!

    """
    The initial unlock amount of a Linear stream.
    Available since Lockup v2.0.
    """
    initialAmount: BigInt

    # ----------------------------- LOCKUP DYNAMIC ----------------------------- #
    """
    Segments of a Dynamic stream.
    """
    segments: [Segment!]! @derivedFrom(field: "stream")

    # ----------------------------- LOCKUP TRANCHED ---------------------------- #
    """
    Segments of a Tranched stream.
    """
    tranches: [Tranche!]! @derivedFrom(field: "stream")
  }
`;

const flowDefs = gql`
  type Stream @entity(immutable: false) {
    ${commonDefs}

    # ---------------------------------- FLOW ---------------------------------- #

    """
    This is equivalent to the value returned by ERC20.balanceOf, and it changes after deposit and withdrawal.
    """
    availableAmount: BigInt!

    """
    The account that created the stream, which can be different from the sender.
    """
    creator: Bytes!

    """
    Unix timestamp indicating the time when the stream will become insolvent.
    """
    depletionTime: BigInt!

    """
    The sum of all deposits.
    """
    depositedAmount: BigInt!

    """
    The amount of debt forgiven by a void action.
    """
    forgivenDebt: BigInt!

    """
    Action in which the payment rate was adjusted.
    """
    lastAdjustmentAction: Action

    """
    Unix timestamp for when the payment rate was adjusted.
    """
    lastAdjustmentTimestamp: BigInt!

    """
    Flag indicating if a stream is paused.
    """
    paused: Boolean!

    """
    Action in which the stream was paused.
    """
    pausedAction: Action

    """
    Unix timestamp for when the stream was paused.
    """
    pausedTime: BigInt

    """
    Current payment rate per second, denominated in 18 decimals.
    """
    ratePerSecond: BigInt!

    """
    The sum of all refunds.
    """
    refundedAmount: BigInt!

    """
    The amount streamed up until the time of the last adjustment, denominated in 18 decimals.
    """
    snapshotAmount: BigInt!

    """
    Flag indicating if a stream is voided.
    """
    voided: Boolean!

    """
    Action in which the stream was voided.
    """
    voidedAction: Action

    """
    Unix timestamp for when the stream was voided.
    """
    voidedTime: BigInt
  }
`;

export function getStreamDefs(protocol: Indexed.Protocol) {
  if (protocol === "airdrops") {
    throw new Error("Airdrops does not have streams");
  }

  return protocol === "lockup" ? lockupDefs : flowDefs;
}
