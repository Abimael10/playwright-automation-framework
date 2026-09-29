import {test as base} from "@playwright/test"
import {BankLoginPage} from "../pages/BankLoginPage"
import { TransferPage } from "../pages/TransferPage";
import { ExternalSendPage } from "../pages/ExternalSendPage";
import { DashboardPage } from "../pages/DashboardPage";
import { AccountsPage } from "../pages/AccountsPage";
import { BillPayPage } from "../pages/BillPayPage";

/**
 * Custom test fixtures extending Playwright's base test.
 *
 * The reason for it is to provide pre-initialized page objects and a per-test logger to all test files, reducing boilerplate.
 *
 * Authenticated test should import from `auth.fixture.ts` which will seed a logged-in storageState.
 *
 * @author Juan Abimael Santos Castillo
 **/

export type CustomFixtures = {
  bankLoginPage: BankLoginPage;
  transferPage: TransferPage;
  externalSendPage: ExternalSendPage;
  dashboardPage: DashboardPage;
  accountsPage: AccountsPage;
  billPayPage: BillPayPage;
}

export const test = base.extend<CustomFixtures>({
  bankLoginPage: async ({page}, use) => {
    const bankLoginPage = new BankLoginPage(page);
    await use(bankLoginPage);
  },

  dashboardPage: async ({page}, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  
  transferPage: async ({ page }, use) => {
    const transferPage = new TransferPage(page);
    await use(transferPage);
  },

  externalSendPage: async ({ page }, use) => {
    const externalSendPage = new ExternalSendPage(page);
    await use(externalSendPage);
  },

  accountsPage: async ({ page }, use) => {
    const accountsPage = new AccountsPage(page);
    await use(accountsPage);
  },

  billPayPage: async ({ page }, use) => {
    const billPayPage = new BillPayPage(page);
    await use(billPayPage);
  }
});