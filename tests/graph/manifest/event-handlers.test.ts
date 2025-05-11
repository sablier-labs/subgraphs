import type { Sablier } from "@sablier/deployments";
import eventHandlers from "@src/manifest/data-sources/event-handlers";
import { resolveEventHandler as resolve } from "@src/manifest/data-sources/event-handlers/helpers";
import type { Manifest } from "@src/types";
import _ from "lodash";

describe("Event handlers", () => {
  describe("Resolver function", () => {
    it("should resolve simple event without indexed params", () => {
      const actual = resolve({
        protocol: "flow",
        version: "v1.0",
        contractName: "SablierFlow",
        eventName: "MetadataUpdate",
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
        protocol: "lockup",
        version: "v1.0",
        contractName: "SablierV2LockupLinear",
        eventName: "CreateLockupLinearStream",
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
        protocol: "lockup",
        version: "v1.0",
        contractName: "SablierV2LockupDynamic",
        eventName: "CreateLockupDynamicStream",
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
        protocol: "lockup",
        version: "v2.0",
        contractName: "SablierLockup",
        eventName: "CreateLockupLinearStream",
      });

      const expectedEvent =
        "CreateLockupLinearStream(indexed uint256,(address,address,address,(uint128,uint128),address,bool,bool,(uint40,uint40),string,address),uint40,(uint128,uint128))";
      const expectedHandler = "handleCreateLockupLinearStream";

      expect(actual).toBeDefined();
      expect(actual.event).toBe(expectedEvent);
      expect(actual.handler).toBe(expectedHandler);
    });
  });

  const protocols = ["flow", "lockup"] as const;
  for (const protocol of protocols) {
    testProtocol(protocol);
  }
});

function testProtocol(protocol: "flow" | "lockup"): void {
  describe(`${protocol} contracts`, () => {
    const handlersByContract = eventHandlers[protocol];

    for (const [contractName, handlersByVersion] of _.entries(handlersByContract)) {
      for (const [version, handlers] of _.entries(handlersByVersion)) {
        describe(`${contractName} in ${protocol} ${version}`, () => {
          for (const handler of handlers) {
            testEventHandler(protocol, contractName, version as Sablier.Version, handler);
          }
        });
      }
    }
  });
}

function testEventHandler(
  protocol: "flow" | "lockup",
  contractName: string,
  version: Sablier.Version,
  actual: Manifest.EventHandler,
): void {
  const eventName = getEventName(actual.handler);

  // We need this test because some handlers are reused between different versions, e.g., Flow v1.0 and v1.1
  it(`should resolve the handler for event ${eventName}`, () => {
    const expected = resolve({
      protocol,
      version,
      contractName,
      eventName,
    });
    expect(actual).toStrictEqual(expected);
  });
}

function getEventName(handler: `handle${string}`): string {
  return handler.substring(6);
}
