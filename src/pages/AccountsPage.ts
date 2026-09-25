import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { parseCurrencyToNumber } from "../utils/currency";

export class AccountsPage extends BasePage {

  //Locators
  private readonly pageTitle: Locator;
  private readonly balanceCells: Locator;
  
  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByTestId("accounts-page-title");
    this.balanceCells = page.getByTestId("account-row-balance");
  }

  //Actions
  async goto(): Promise<void> {
    await this.navigateTo("/bank/accounts");
    await this.assertLoaded();
  }

  async getAccountBalances(): Promise<number[]> {
    await expect(this.balanceCells.first()).toBeVisible();
    const texts = await this.balanceCells.allTextContents();
    return texts.map((t) => parseCurrencyToNumber(t));
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.pageTitle);
    await expect(this.balanceCells.first()).toBeVisible();
  }
}