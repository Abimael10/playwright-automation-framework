import { test } from "../../src/fixtures/auth.fixture"
import type { ExternalSendPage } from "../../src/pages/ExternalSendPage"

test.describe("External Bank Transfers @regression", () => {
  test.beforeEach(async ({ externalSendPage }: { externalSendPage: ExternalSendPage }) => {
    await externalSendPage.goto();
  });

  test("should load external transfer portal correctly @regression", async ({ externalSendPage }: { externalSendPage: ExternalSendPage }) => {
    await externalSendPage.assertLoaded();
  });
})