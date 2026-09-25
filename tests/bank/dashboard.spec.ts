import { test, expect } from "../../src/fixtures/auth.fixture"
import type { DashboardPage } from "../../src/pages/DashboardPage"
import type { AccountsPage } from "../../src/pages/AccountsPage";

test.describe("Dashboard Bank Information @regression", () => {
  test.beforeEach(async ({ dashboardPage }: { dashboardPage: DashboardPage }) => { 
    await dashboardPage.goto();
  });

  test("dashboard loads successfully with welcome message @regression", async ({ dashboardPage }: { dashboardPage: DashboardPage }) => {
    await dashboardPage.assertLoaded();
  });

  test("verify total balance display @regression", async ({
    dashboardPage,
    accountsPage
  }: {
      dashboardPage: DashboardPage;
      accountsPage: AccountsPage;
  }) => {
    //Step 1. Dashboard total (beforeEach already did goto)
    await dashboardPage.assertLoaded();
    const total = await dashboardPage.getNetWorthValue();

    //Step 2. Go via sidebar, to accounts and the parts
    await dashboardPage.fromDashboardGotoAccounts();
    await accountsPage.assertLoaded();
    const balances = await accountsPage.getAccountBalances();
    expect(balances.length).toBeGreaterThan(0);
    const sum = balances.reduce((acc, bal) => acc + bal, 0);

    //Step 3. Total == sum of parts
    expect(
      sum,
      `Net worth ${total} should equal sum of ${balances.length} accounts [${balances.join(', ')}]`
    ).toBeCloseTo(total, 2);
  })
})