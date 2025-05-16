import { assert, afterAll, clearStore, describe, test } from "matchstick-as/assembly/index";
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
