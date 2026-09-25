import { Page, Locator } from "@playwright/test";

export class SidebarComponent {
  readonly accountsLink: Locator;
  
  constructor(private page: Page) {
    this.accountsLink = page.getByTestId("sidebar-link-accounts");
  }

  async gotoAccounts(): Promise<void> {
    await this.accountsLink.click();
    await this.page.waitForURL(/\/bank\/accounts/);
  }
}