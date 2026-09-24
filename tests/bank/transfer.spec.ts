import { test } from "../../src/fixtures/base.fixture";
import { TransferPage } from "../../src/pages/TransferPage";

test.describe("Bank Transfers @regression", () => {
  test.beforeEach(async ({ transferPage }: { transferPage: TransferPage }) => {
    await transferPage.goto();
  });

  test("shold load transfer page correctly @regression", async ({ transferPage }: { transferPage: TransferPage }) => {
    await transferPage.assertLoaded();
  })
})