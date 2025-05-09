import { resolveEventHandler } from "@src/manifest/helpers";
// import type { Manifest } from "@src/types";

describe("Manifest", () => {
  describe("Event handlers", () => {
    it("should resolve simple event without indexed params", () => {
      const eh = resolveEventHandler({
        protocol: "flow",
        version: "v1.0",
        contractName: "SablierFlow",
        eventName: "MetadataUpdate",
      });

      const expectedEvent = "MetadataUpdate(uint256)";
      const expectedHandler = "handleMetadataUpdate";

      expect(eh).toBeDefined();
      expect(eh.event).toBe(expectedEvent);
      expect(eh.handler).toBe(expectedHandler);
    });

    it("should resolve simple event with indexed params", () => {
      const eh = resolveEventHandler({ contractName: "ERC721", eventName: "Approval" });

      const expectedEvent = "Approval(indexed address,indexed address,indexed uint256)";
      const expectedHandler = "handleApproval";

      expect(eh).toBeDefined();
      expect(eh.event).toBe(expectedEvent);
      expect(eh.handler).toBe(expectedHandler);
    });

    it("should resolve event handler for event with tuple", () => {
      const eh = resolveEventHandler({
        protocol: "lockup",
        version: "v1.0",
        contractName: "SablierV2LockupLinear",
        eventName: "CreateLockupLinearStream",
      });

      const expectedEvent =
        "CreateLockupLinearStream(uint256,address,indexed address,indexed address,(uint128,uint128,uint128),indexed address,bool,(uint40,uint40,uint40),address)";
      const expectedHandler = "handleCreateLockupLinearStream";

      expect(eh).toBeDefined();
      expect(eh.event).toBe(expectedEvent);
      expect(eh.handler).toBe(expectedHandler);
    });

    it("should resolve event handler for event with arrays of tuples", () => {
      const eh = resolveEventHandler({
        protocol: "lockup",
        version: "v1.0",
        contractName: "SablierV2LockupDynamic",
        eventName: "CreateLockupDynamicStream",
      });

      const expectedEvent =
        "CreateLockupDynamicStream(uint256,address,indexed address,indexed address,(uint128,uint128,uint128),indexed address,bool,(uint128,uint64,uint40)[],(uint40,uint40),address)";
      const expectedHandler = "handleCreateLockupDynamicStream";

      expect(eh).toBeDefined();
      expect(eh.event).toBe(expectedEvent);
      expect(eh.handler).toBe(expectedHandler);
    });

    it("should resolve event handler for event with tuple nested within tuple", () => {
      const eh = resolveEventHandler({
        protocol: "lockup",
        version: "v2.0",
        contractName: "SablierLockup",
        eventName: "CreateLockupLinearStream",
      });

      const expectedEvent =
        "CreateLockupLinearStream(indexed uint256,(address,address,address,(uint128,uint128),address,bool,bool,(uint40,uint40),string,address),uint40,(uint128,uint128))";
      const expectedHandler = "handleCreateLockupLinearStream";

      expect(eh).toBeDefined();
      expect(eh.event).toBe(expectedEvent);
      expect(eh.handler).toBe(expectedHandler);
    });
  });
});
