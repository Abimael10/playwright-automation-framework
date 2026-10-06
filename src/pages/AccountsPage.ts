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
  private readonly addAccountButton: Locator;
  private readonly newAccountNameField: Locator;
  private readonly newAccountTypeField: Locator;
  private readonly newAccountStartingBalance: Locator;
  private readonly newAccountTermsField: Locator;
  private readonly newAccountAddButtonForm: Locator;
  
  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByTestId("accounts-page-title");
    this.balanceCells = page.getByTestId("account-row-balance");
    this.accountsField = page.getByTestId("account-row");
    this.checkingRow = page.getByTestId("account-row").filter({ hasText: "Checking" });
    this.savingsRow = page.getByTestId("account-row").filter({ hasText: "Savings" });
    //this.overdrawnBadge = page.getByTestId("account-row-overdrawn");
    this.frozenAccountBanner = page.getByTestId("frozen-account-banner");
    this.addAccountButton = page.getByRole("button", ({ name: "Add Account" }));
    this.newAccountNameField = page.getByRole('textbox', ({ name: "Account Name" }));
    this.newAccountTypeField = page.getByRole('combobox', ({ name: "Account Type" }));
    this.newAccountStartingBalance = page.getByPlaceholder('0.00');
    this.newAccountTermsField = page.getByRole('checkbox', ({ name: "I accept the terms and conditions" }));
    this.newAccountAddButtonForm = page.getByTestId("save-account-form-btn");
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

  async createNewSavingsAccount(account_name: string, account_type: string, account_balance: string): Promise<void> {
    await this.assertVisible(this.addAccountButton);
    await this.addAccountButton.click();

    //Expect fields to be present
    await expect(this.newAccountNameField).toBeVisible();
    await expect(this.newAccountTypeField).toBeVisible();
    await expect(this.newAccountStartingBalance).toBeVisible();
    await expect(this.newAccountTermsField).toBeVisible();
    await expect(this.newAccountAddButtonForm).toBeVisible();

    //Complete the form to create the new account
    await this.fill(this.newAccountNameField, account_name);
    await this.click(this.newAccountTypeField);
    await this.click(this.page.getByRole("option", ({ name: account_type })));
    await this.newAccountStartingBalance.clear();
    await this.fill(this.newAccountStartingBalance, account_balance);
    await this.click(this.newAccountTermsField);
    await this.click(this.newAccountAddButtonForm);

    //Validate that the account created contains the name of the account we have given to it to match for one single element
    await expect(this.savingsRow.getByTestId("account-row-name").filter({
      hasText: account_name
    })).toHaveCount(1);
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