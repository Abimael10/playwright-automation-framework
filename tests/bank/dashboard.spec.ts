import { test } from "../../src/fixtures/auth.fixture"
import type { DashboardPage } from "../../src/pages/DashboardPage"

test.describe("Dashboard Bank Information @regression", () => {
  test.beforeEach(async ({ dashboardPage }: { dashboardPage: DashboardPage }) => { 
    await dashboardPage.goto();
  });

  test("dashboard loads successfully with welcome message @regression", async ({ dashboardPage }: { dashboardPage: DashboardPage }) => {
    await dashboardPage.assertLoaded();
  });
})