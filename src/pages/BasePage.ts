import { Page, Locator, expect } from "@playwright/test";
import { ConfigManager } from "../utils/ConfigManager";

export class BasePage {
  protected page: Page;
  protected readonly actionTimeout: number;
  protected readonly waitTimeout: number;

  constructor(page: Page) {
    this.page = page;

    const config = ConfigManager.getInstance();
    this.actionTimeout = config.getActionTimeout();
    this.waitTimeout = config.getExpectTimeout();
  }

  //Navigation
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, {waitUntil: 'domcontentloaded'})
  }

  //Element interactions
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: this.actionTimeout
    });
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: this.actionTimeout
    });
    await locator.clear();
    await locator.fill(text);
  }

  //Wait utilities
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: "visible",
      timeout: timeout ?? this.waitTimeout
    });
  }

  //Assertions
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertTitle(expectedTitle: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}