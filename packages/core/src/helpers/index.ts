import {
  Address,
  BigInt,
  dataSource,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import {
  Action,
  Contract,
  Group,
  Grouper,
  Stream,
  Token,
  Watcher,
} from "../generated/types/schema";
import { ERC20 as ERC20Contract } from "../generated/types/templates/ContractLinear/ERC20";
import { one, zero } from "../constants";

export function generateActionId(event: ethereum.Event): string {
  return event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
}

export function createAction(event: ethereum.Event): Action {
  let id = generateActionId(event);
  let entity = new Action(id);

  entity.block = event.block.number;
  entity.from = event.transaction.from;
  entity.hash = event.transaction.hash;
  entity.timestamp = event.block.timestamp;

  /** --------------- */
  let contract = getContractById(dataSource.address().toHexString());
  if (contract == null) {
    log.critical(
      "Contract hasn't been registered before this create event: {}",
      [dataSource.address().toHexString()],
    );
  } else {
    entity.contract = contract.id;
  }

  return entity;
}

export function generateStreamId(localId: BigInt): string {
  let contract = getContractById(dataSource.address().toHexString());
  if (contract == null) {
    log.critical(
      "Contract hasn't been registered before this create event: {}",
      [dataSource.address().toHexString()],
    );
    return "";
  }

  let id = contract.address
    .toHexString()
    .substr(2, 8)
    .concat("-")
    .concat(localId.toString());

  return id;
}

export function getStreamByIdFromSource(localId: BigInt): Stream | null {
  let id = generateStreamId(localId);
  return Stream.load(id);
}

export function getOrCreateToken(address: Address): Token {
  let id = address.toHexString();
  let entity = Token.load(id);

  if (entity == null) {
    entity = new Token(address.toHexString());

    let contract = ERC20Contract.bind(address);
    let decimals = contract.decimals();
    let symbol = contract.symbol();

    entity.address = address;
    entity.symbol = symbol;
    entity.decimals = BigInt.fromI32(decimals);

    entity.save();
  }

  return entity;
}

export function getContractById(id: string): Contract | null {
  return Contract.load(id);
}

export function createContract(address: Address, type: string): Contract {
  let id = address.toHexString();
  let entity = getContractById(id);
  if (entity == null) {
    entity = new Contract(id);
  }

  entity.address = address;
  entity.type = type;

  entity.save();

  return entity;
}

export function getOrCreateGrouper(sender: Address): Grouper {
  let id = sender.toHexString();
  let entity = Grouper.load(id);

  if (entity == null) {
    entity = new Grouper(id);
    entity.address = sender;
    entity.groupIndex = zero;
  }

  return entity;
}

export function getOrCreateGroup(
  event: ethereum.Event,
  sender: Address,
): Group {
  let id = event.transaction.hash.toHexString();
  let entity = Group.load(id);
  let grouper = getOrCreateGrouper(sender);

  if (entity == null) {
    entity = new Group(id);
    entity.hash = event.transaction.hash;
    entity.timestamp = event.block.timestamp;
    entity.grouper = grouper.id;
    entity.count = one;
  } else {
    entity.count = entity.count.plus(one);
    if (BigInt.compare(entity.count, one) == 1 && entity.label == null) {
      let label = grouper.groupIndex.plus(one).toString();
      entity.label = label;
      grouper.groupIndex = grouper.groupIndex.plus(one);
      grouper.save();
    }
  }

  entity.save();

  return entity;
}

export function getOrCreateWatcher(): Watcher {
  let id = "1";
  let entity = Watcher.load(id);

  if (entity == null) {
    entity = new Watcher(id);
    entity.streamIndex = one;
    entity.isInitialized = false;
  }

  return entity;
}