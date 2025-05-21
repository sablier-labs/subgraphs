import type { Sablier } from "@sablier/deployments";
import { resolveEventHandler as resolve } from "@src/events/resolver";
import eventHandlers from "@src/graph-manifest/sources/event-handlers";
import type { Manifest } from "@src/graph-manifest/types";
import type { Indexed } from "@src/types";
import _ from "lodash";

describe("Event handlers", () => {
  describe("Resolver function", () => {
    it("should resolve simple event without indexed params", () => {
      const actual = resolve({
        contractName: "SablierFlow",
        eventName: "MetadataUpdate",
        protocol: "flow",
        version: "v1.0",
      });

      const expectedEvent = "MetadataUpdate(uint256)";
      const expectedHandler = "handleMetadataUpdate";

      expect(actual).toBeDefined();
      expect(actual.event).toBe(expectedEvent);
      expect(actual.handler).toBe(expectedHandler);
    });

    it("should resolve simple event with indexed params", () => {
      const actual = resolve({ contractName: "ERC721", eventName: "Approval" });

      const expectedEvent = "Approval(indexed address,indexed address,indexed uint256)";
      const expectedHandler = "handleApproval";

      expect(actual).toBeDefined();
      expect(actual.event).toBe(expectedEvent);
      expect(actual.handler).toBe(expectedHandler);
    });

    it("should resolve event handler for event with tuple", () => {
      const actual = resolve({
        contractName: "SablierV2LockupLinear",
        eventName: "CreateLockupLinearStream",
        protocol: "lockup",
        version: "v1.0",
      });

      const expectedEvent =
        "CreateLockupLinearStream(uint256,address,indexed address,indexed address,(uint128,uint128,uint128),indexed address,bool,(uint40,uint40,uint40),address)";
      const expectedHandler = "handleCreateLockupLinearStream";

      expect(actual).toBeDefined();
      expect(actual.event).toBe(expectedEvent);
      expect(actual.handler).toBe(expectedHandler);
    });

    it("should resolve event handler for event with arrays of tuples", () => {
      const actual = resolve({
        contractName: "SablierV2LockupDynamic",
        eventName: "CreateLockupDynamicStream",
        protocol: "lockup",
        version: "v1.0",
      });

      const expectedEvent =
        "CreateLockupDynamicStream(uint256,address,indexed address,indexed address,(uint128,uint128,uint128),indexed address,bool,(uint128,uint64,uint40)[],(uint40,uint40),address)";
      const expectedHandler = "handleCreateLockupDynamicStream";

      expect(actual).toBeDefined();
      expect(actual.event).toBe(expectedEvent);
      expect(actual.handler).toBe(expectedHandler);
    });

    it("should resolve event handler for event with tuple nested within tuple", () => {
      const actual = resolve({
        contractName: "SablierLockup",
        eventName: "CreateLockupLinearStream",
        protocol: "lockup",
        version: "v2.0",
      });

      const expectedEvent =
        "CreateLockupLinearStream(indexed uint256,(address,address,address,(uint128,uint128),address,bool,bool,(uint40,uint40),string,address),uint40,(uint128,uint128))";
      const expectedHandler = "handleCreateLockupLinearStream";

      expect(actual).toBeDefined();
      expect(actual.event).toBe(expectedEvent);
      expect(actual.handler).toBe(expectedHandler);
    });
  });

  // TODO: might have to delete these tests
  const protocols = ["airdrops", "flow", "lockup"] as const;
  for (const protocol of protocols) {
    testProtocol(protocol);
  }
});

function testProtocol(protocol: Indexed.Protocol): void {
  describe(`${protocol} contracts`, () => {
    const handlersByContract = eventHandlers[protocol];

    for (const [contractName, handlersByVersion] of _.entries(handlersByContract)) {
      for (const [version, handlers] of _.entries(handlersByVersion)) {
        describe(`${contractName} in ${protocol} ${version}`, () => {
          for (const handler of handlers) {
            testEventHandler(protocol, version as Sablier.Version, contractName, handler);
          }
        });
      }
    }
  });
}

function testEventHandler(
  protocol: Indexed.Protocol,
  version: Sablier.Version,
  contractName: string,
  actual: Manifest.EventHandler,
): void {
  const eventName = getEventName(actual.event);

  // We test this because some handlers are reused between releases, e.g., Flow v1.0 and v1.1
  it(`should resolve the handler for event ${eventName}`, () => {
    const expected = resolve({
      contractName,
      eventName,
      protocol,
      version,
    });
    expect(actual.event).toBe(expected.event);

    // Some handlers have a suffix, which we don't want to test
    expect(actual.handler.startsWith(`handle${eventName}`)).toBeTruthy();
  });
}

function getEventName(eventSignature: string): string {
  return eventSignature.substring(0, eventSignature.indexOf("("));
}
