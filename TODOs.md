# TODOs

## Priority 1

- [ ] Envio Airdrops
- [x] Envio Lockup
- [ ] Reuse `Action_t` type and `Asset_t` type between Flow and Lockup
- [x] Test to ensure the same mappings directory structure between indexers
- [x] Params for create in Flow

## Priority 2

- [ ] Create Action before Stream?
- [ ] Matchstick tests
- [ ] Reuse GraphQL schema for Stream

## Priority 3

- [ ] Run Dockerized version of Envio

## Priority 4

- [ ] Add Husky
- [ ] Bring back CHANGELOGs
- [ ] Reuse asset, batch, and watcher logic; note: this is difficult

---

# Previous TODOs

## Priority 1

- [x] DRYify schemas between Airdrops and Flow/Lockup with TypeScript gql
- [x] Envio Flow
- [x] Mappings for `claimLockup`
- [x] Document each GraphQL entity
- [x] Refactor all manifest objects to be structured by contract
- [x] Upgrade to latest @graphprotocol
- [x] Use `@src` in Envio mappings

## Priority 2

- [x] Define a type for the indexed contracts
- [x] Generate GraphQL enums from TypeScript definitions
- [x] Run `graph build` in CI
- [x] Throw when no contract is found for chain in `codegen/manifest`
- [x] Tests for checking that common handlers exist in all ABIs
- [x] Upgrade to latest `specVersion` and `apiVersion`

## Priority 3

- [x] Immutable entities - check if `derivedFrom` breaks this
- [x] Use Biome config from `@sablier/configs`
- [x] Standardize address type used in Envio

## Priority 4

- [x] Add CI
- [x] Open issue to implement `isNotZero`
