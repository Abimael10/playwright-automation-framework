import { test, expect } from "../../src/fixtures/auth.fixture";
import type { Page } from "@playwright/test";
import type { AccountDetailsPage } from "../../src/pages/AccountDetailsPage";
import type { AccountsPage } from "../../src/pages/AccountsPage";

test.describe("Accounts page tests @regression", () => {
  test.beforeEach(async ({ accountsPage }: { accountsPage: AccountsPage }) => {
    await accountsPage.goto();
  });

  test("accounts page loads and displays user's accounts", async ({ accountsPage }: { accountsPage: AccountsPage }) => {
    await accountsPage.assertLoaded();

    await accountsPage.assertAccountsAreListed();
  });

  test("verify account details display @regression", async ({
    page,
    accountsPage,
    accountDetailsPage
  }: {
    page: Page;
    accountsPage: AccountsPage;
    accountDetailsPage: AccountDetailsPage
  }) => {
    //Step 1. List page => select pinned account
    await accountsPage.assertAccountsAreListed();
    await accountsPage.viewCheckingAccount();

    //Step 2. Detail landing
    await accountDetailsPage.assertLoaded();

    //Step 3. Name and type, exact content
    expect(await accountDetailsPage.getAccountName()).toBe("Everyday Checking");
    expect(await accountDetailsPage.getAccountType()).toBe("Checking");

    //Step 4. Masked number: **** + last 4 digits
    const masked = await accountDetailsPage.getMaskedNumber();
    expect(masked, `account number "${masked}" should look like ****0000`).toMatch(/^\*{4}\d{4}$/);
    await expect(page.getByText(/\d{5,}/)).toHaveCount(0);
  });
})