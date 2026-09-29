import { Page, Locator } from "@playwright/test";
import { expect } from "../../fixtures/auth.fixture";

export class SidebarComponent {
  readonly accountsLink: Locator;
  readonly transferLink: Locator;
  readonly billPayLink: Locator;
  readonly lightIconBtn: Locator;
  readonly darkIconBtn: Locator;
  
  constructor(private page: Page) {
    this.accountsLink = page.getByTestId("sidebar-link-accounts");
    this.transferLink = page.getByTestId("sidebar-link-transfer");
    this.billPayLink = page.getByTestId("sidebar-link-bill-pay");
    this.lightIconBtn = page.getByRole('button', ({ name: "Switch to light mode" }));
    this.darkIconBtn = page.getByRole('button', ({ name: "Switch to dark mode" }));
  }

  async gotoAccounts(): Promise<void> {
    await this.accountsLink.click();
    await this.page.waitForURL(/\/bank\/accounts/);
  }

  async gotoTransfer(): Promise<void> {
    await this.transferLink.click();
    await this.page.waitForURL(/\/bank\/transfer/);
  }

  async gotoBillPay(): Promise<void> {
    await this.billPayLink.click();
    await this.page.waitForURL(/\/bank\/bill-pay/);
  }

  async switchToLightMode(): Promise<void> {
    await this.lightIconBtn.click();
    //Validate it changed by checking the opposite theme is visible to be changed
    await expect(this.darkIconBtn).toBeVisible();
  }

  async switchToDarkMode(): Promise<void> {
    await this.darkIconBtn.click();
    //Validate it changed by checking the opposite theme is visible to be changed
    await expect(this.lightIconBtn).toBeVisible();
  }
}