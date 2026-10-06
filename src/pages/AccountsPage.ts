import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { parseCurrencyToNumber } from "../utils/currency";

export class AccountsPage extends BasePage {

  //Locators
  private readonly pageTitle: Locator;
  private readonly balanceCells: Locator;
  private readonly accountsField: Locator;
  private readonly checkingRow: Locator;
  private readonly savingsRow: Locator;
  //private readonly overdrawnBadge: Locator;
  private readonly frozenAccountBanner: Locator;
  
  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByTestId("accounts-page-title");
    this.balanceCells = page.getByTestId("account-row-balance");
    this.accountsField = page.getByTestId("account-row");
    this.checkingRow = page.getByTestId("account-row").filter({ hasText: "Checking" });
    this.savingsRow = page.getByTestId("account-row").filter({ hasText: "Savings" });
    //this.overdrawnBadge = page.getByTestId("account-row-overdrawn");
    this.frozenAccountBanner = page.getByTestId("frozen-account-banner");
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

  async getOverdrawnBadgeOnNegativeCheckingAccount(): Promise<void> {
    await expect(this.checkingRow).toBeVisible();
    await expect(this.checkingRow).toContainText("Overdrawn");
    await expect(this.savingsRow.getByTestId("account-row-overdrawn")).toHaveCount(0);
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.pageTitle);
    await expect(this.balanceCells.first()).toBeVisible();
  }

  async assertAccountsAreListed(): Promise<void> {
    //Validate both checking and savings accounts are rendered
    await expect(this.accountsField).toHaveCount(2);
    
    //Assert the accounts by content and not position
    const checking = this.accountsField.filter({ hasText: "Checking" });
    const savings = this.accountsField.filter({ hasText: "Savings" });

    //Validate checking account
    await expect(checking).toHaveCount(1);
    await expect(checking).toBeVisible();

    //Validate savings account
    await expect(savings).toHaveCount(1);
    await expect(savings).toBeVisible();
  }

  async viewCheckingAccount(): Promise<void> {
    const checking = this.accountsField.filter({ hasText: "Checking" });
    await expect(checking).toHaveCount(1);
    await checking.getByRole("button", ({ name: "View" })).click();
    await this.page.waitForURL(/\/bank\/accounts\/.+/);
  }

  async assertFrozenAccountBanner(): Promise<void> {
    await expect(this.frozenAccountBanner).toBeVisible();
  }
}