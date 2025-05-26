
import { resolveEventHandler as resolve } from "@src/events/resolver";

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
});
