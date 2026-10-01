import { test, expect } from "../../src/fixtures/auth.fixture";
import { AccountsPage } from "../../src/pages/AccountsPage";

test.describe("Accounts page tests @regression", () => {
  test.beforeEach(async ({ accountsPage }: { accountsPage: AccountsPage }) => {
    await accountsPage.goto();
  });

  test("accounts page loads and displays user's accounts", async ({ accountsPage }: { accountsPage: AccountsPage }) => {
    await accountsPage.assertLoaded();

    await accountsPage.assertAccountsAreListed();
  });
})