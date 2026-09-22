import {test as base} from "@playwright/test"
import {BankLoginPage} from "../pages/BankLoginPage"

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
}

export const test = base.extend<CustomFixtures>({
  bankLoginPage: async ({page}, use) => {
    const bankLoginPage = new BankLoginPage(page);
    await use(bankLoginPage);
  }
});