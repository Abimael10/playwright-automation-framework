import {test as base} from './base.fixture'
import type {Browser} from '@playwright/test'
import {BankLoginPage} from '../pages/BankLoginPage'
import {TestDataManager} from '../utils/TestDataManager'
//import { stat } from 'fs';

type AuthWorkerFixtures = {
  workerStorageState: string;
}

export const test = base.extend<object, AuthWorkerFixtures> ({
  workerStorageState: [
    async ({browser}: {browser: Browser}, use) => {
      const user = TestDataManager.getInstance().getValidUser();
      //Worker context needs baseURL to relative goto ('bank/login') resolves
      const {ConfigManager} = await import("../utils/ConfigManager");
      const baseURL = ConfigManager.getInstance().getBaseUrl();
      const context = await browser.newContext({baseURL});
      const page = await context.newPage();
      const loginPage = new BankLoginPage(page);

      try {
        await loginPage.goto();
        await loginPage.login(user.username, user.password);
        //Wait for authenticated landing; the bank redirects to /bank/dashboard
        await page.waitForURL(/\/bank\/dashboard/, {timeout: 15000});
      } catch (e) {
        await context.close().catch(() => {});
        const msg = e instanceof Error ? e.message : String (e);
        throw new Error(`Worker authentication failed: ${msg}`, {cause: e});
      }

      const state = await context.storageState();
      await context.close();

      //Validate that we actually captured an authenticated state
      const hasCookies = state.cookies.length > 0;
      const hasOrigins = state.origins !== undefined && state.origins.length > 0;

      if (!hasCookies && !hasOrigins) {
        throw new Error("Worker has failed: storageState is empty after login - login may not have established a session")
      }

      await use(JSON.stringify(state));
    },
    {scope: "worker"}
  ],

  //Seed each test's context with the worker's authenticated storageState
  storageState: async ({workerStorageState}, use) => {
    const state = JSON.parse(workerStorageState);
    await use(state);
  }
});

export {expect} from '@playwright/test'