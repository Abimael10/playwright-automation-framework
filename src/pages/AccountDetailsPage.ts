import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountDetailsPage extends BasePage {
  private readonly container: Locator;
  private readonly accountName: Locator;
  private readonly accountType: Locator;
  private readonly maskedNumber: Locator;
  
  constructor(page: Page) {
    super(page);

    this.container = page.getByTestId("account-detail-page");
    this.accountName = page.getByTestId("account-detail-name");
    this.accountType = page.getByTestId("account-detail-type-badge");
    this.maskedNumber = this.container.getByText(/\*{4}\d{4}/);
  }

  //Actions
  async getAccountName(): Promise<string> {
    return ((await this.accountName.textContent()) ?? "").trim();
  }

  async getAccountType(): Promise<string> {
    return ((await this.accountType.textContent()) ?? "").trim();
  }

  async getMaskedNumber(): Promise<string> {
    return ((await this.maskedNumber.first().textContent()) ?? "").trim();
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.accountName);
    await this.assertVisible(this.maskedNumber);
  }
}