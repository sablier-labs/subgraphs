# CHANGELOG

## V2.3

- All flavors of **Lockup** contracts have been aggregated in a single **Lockup Merged** contract

- Signatures for all **Create** events have been changed

- A new `fee` is now tracked using `msg.sender` in `Withdraw` events

- Cliffs are now non-proportional, meaning cliff amount and cliff duration are independently customizable

- **Lockup Linear** (as part of **Lockup Merged**) now includes an "initial unlock" amount

- All streams will receive a `shape` parameter to identify their supposed shape easily in the UI

## V2.2

- **Create** events do not include a `protocolFee` amount any more (protocol fees have been removed): the fees will be
  tracked only for V2.1 and V2.0, while for next version we'll assign a generic fee of zero

- **Create** events contain a renamed parameters: from `range` to `timestamps`. The conversion isn't tedious (see event
  gateway) as the parameters remains on the 8th position (gets casted automatically from the parameter array)

- **Create Lockup Linear** events will handle `cliff` time differently: while in prior versions, a non-cliff stream had
  a `range.cliff === range.start`, for V2.2 non-cliff streams will showcase a `timestamps.cliff` equal to zero

- **Lockup Tranched**: a new flavor of Lockup contract has been added

## V2.1

### System

- **Proxy** and proxy stream creation is not needed any more, so proxy tracking will be disabled

### Events

- **Create** events include a `transferable` boolean
- **Cancel** events emit an `asset` address
- **Withdraw** events emit an `asset` address

## V2.0
