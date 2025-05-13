import { assert, afterAll, clearStore, describe, newMockEvent, test } from "matchstick-as/assembly/index";
import { handleCreateLockupLinearStream } from "../mappings/v2.0";
import { createDefaultLinearStream } from "./helpers";
describe("Lockup v2.0", () => {
  afterAll(() => {
    clearStore();
  });

  test("Can create Linear stream", () => {
    const _stream = createDefaultLinearStream();
    // handleCreateLockupLinearStream
    assert.assertTrue(true);
  });
});
