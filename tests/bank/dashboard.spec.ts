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
  });

  test("recent transactions widget displays up to 5 latest transactions", async ({ dashboardPage }: { dashboardPage: DashboardPage }) => {
    //Step 1. Dashboard and widget are present.
    await dashboardPage.assertLoaded();
    const count = await dashboardPage.getRecentTransactionCount();

    //Step 2. Check the count is up to 5, but not empty
    expect(count, "widget should show at least 1 transaction").toBeGreaterThan(0);
    expect(count, `widget showed ${count} transactions, max is 5`).toBeLessThanOrEqual(5);

    //Step 3. Newest first
    const dates = await dashboardPage.getRecentTransactionDates();
    expect(dates.length).toEqual(count);
    for (let i = 0; i < dates.length - 1; i++) {
      expect(
        dates[i].getTime(),
        `row ${i} (${dates[i].toDateString()}) should be newer than row ${i + 1} (${dates[i + 1].toDateString()})`
      ).toBeGreaterThanOrEqual(dates[i + 1].getTime());
    }
  });
})