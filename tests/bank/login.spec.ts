import {test} from "../../src/fixtures/base.fixture"
import type {BankLoginPage} from "../../src/pages/BankLoginPage"

test.describe("Bank Login @regression", () => {
  test.beforeEach(async ({bankLoginPage}: {bankLoginPage: BankLoginPage}) => {
    await bankLoginPage.goto();
  });

  test("should load login page correctly @smoke @regression", async ({bankLoginPage}: {bankLoginPage: BankLoginPage}) => {
    //Step 1. Assert login page elements are visible
    await bankLoginPage.assertLoaded();

    //Step 2. Assert title constains expected text
    await bankLoginPage.assertTitleContains(/QA Playground|SecureBank/i);
  })
})