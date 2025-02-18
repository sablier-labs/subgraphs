# CHANGELOG

## V2.3

- **Merkle Lockup** is now accompanied by **Merkle Instant**: the new variant will produce airdrops with tokens instead
  of streams

- All flavors of **Lockup** contracts have been aggregated in a single **Lockup Merged** contract

- Signatures for all **Create** events have been changed

- A new `fee` is now tracked using `msg.sender` in `Claim` events

## V2.2

- **Merkle Streamer** has been renamed to **Merkle Lockup**: events will now include this name change e.g.
  `CreateMerkleLL`

- **Create** events now include a `name` string parameter for campaigns

- **Create** events have changed their signature to include a `baseParams` tuple

- **Lockup Tranched**: a new flavor of Lockup contract has been added, together with the `CreateMerkleLT` event

- **Merkle Lockup**s now include a grace period (7 days **after** the first claim) when funds can be clawed-back to
  prevent accidents during configuration. Campaigns will now have a mandatory clawback period at the start and an
  optional one (based on expiration) in the end.

## V2.1

> [!IMPORTANT]  
> The Merkle Lockup periphery was implemented only after V2.1, so there's no support for V2.0 with it.
