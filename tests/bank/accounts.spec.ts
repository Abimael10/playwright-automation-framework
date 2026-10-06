import { test, expect } from "../../src/fixtures/auth.fixture";
import { TestDataManager } from "../../src/utils/TestDataManager";
import type { BankLoginPage } from "../../src/pages/BankLoginPage";
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
});

test.describe("overdraft @regression", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("overdraft indicator on negative balance checking account @regression", async ({
    page,
    bankLoginPage,
    accountsPage
  }: {
    page: Page;
    bankLoginPage: BankLoginPage;
    accountsPage: AccountsPage;
  }) => {
    //Step 1. Login as overdraft_user (fresh session, not the worker's standard_user)
    const user = TestDataManager.getInstance().getOverdraftUser();
    await bankLoginPage.goto();
    await bankLoginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/\/bank\/dashboard/); //Needs `page` in the signature

    //Step 2. Accounts page
    await accountsPage.goto();
    await accountsPage.assertLoaded();

    //Step 3. Overdrawn badge on the negative checking account
    await accountsPage.getOverdrawnBadgeOnNegativeCheckingAccount();
  });
});

test.describe("frozen accounts @regression", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("frozen accounts display a prominent disabled banner @regression", async ({
    page,
    bankLoginPage,
    accountsPage
  }: {
    page: Page;
    bankLoginPage: BankLoginPage;
    accountsPage: AccountsPage;
  }) => {
    const user = TestDataManager.getInstance().getFrozenUser();
    await bankLoginPage.goto();
    await bankLoginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/\/bank\/dashboard/);

    await accountsPage.goto();
    await accountsPage.assertLoaded();

    await accountsPage.assertFrozenAccountBanner();
  });
});