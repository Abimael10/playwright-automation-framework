import { Page, Locator } from "@playwright/test";

export class SidebarComponent {
  readonly accountsLink: Locator;
  readonly transferLink: Locator;
  
  constructor(private page: Page) {
    this.accountsLink = page.getByTestId("sidebar-link-accounts");
    this.transferLink = page.getByTestId("sidebar-link-transfer");
  }

  async gotoAccounts(): Promise<void> {
    await this.accountsLink.click();
    await this.page.waitForURL(/\/bank\/accounts/);
  }

  async gotoTransfer(): Promise<void> {
    await this.transferLink.click();
    await this.page.waitForURL(/\/bank\/transfer/);
  }
}