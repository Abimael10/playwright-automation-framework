import { Page, Locator } from "@playwright/test";

export class SidebarComponent {
  readonly accountsLink: Locator;
  readonly transferLink: Locator;
  readonly billPayLink: Locator;
  
  constructor(private page: Page) {
    this.accountsLink = page.getByTestId("sidebar-link-accounts");
    this.transferLink = page.getByTestId("sidebar-link-transfer");
    this.billPayLink = page.getByTestId("sidebar-link-bill-pay");
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
}