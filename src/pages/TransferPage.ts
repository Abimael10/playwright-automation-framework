import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransferPage extends BasePage {

  private readonly transferHeading: Locator;
  private readonly fromAccountField: Locator;
  private readonly toAccountField: Locator;
  private readonly amountField: Locator;
  private readonly todayRadioOption: Locator;
  private readonly sendTransferBtn: Locator;
  private readonly confirmDialog: Locator;
  private readonly confirmTransferBtn: Locator;
  private readonly successHeading: Locator;
  private readonly transferErrorMessage: Locator;
  
  constructor(page: Page) {
    super(page);

    this.transferHeading = page.getByRole('heading', ({ name: 'Transfer Money' }));
    this.fromAccountField = page.getByRole('combobox', ({ name: 'From Account' }));
    this.toAccountField = page.getByRole('combobox', ({ name: 'To Account' }));
    this.amountField = page.getByRole('spinbutton', ({ name: 'Amount' }));
    this.todayRadioOption = page.getByRole('radio', ({ name: "Today" }));
    this.sendTransferBtn = page.getByRole('button', ({ name: "Review Transfer" }));
    this.confirmDialog = page.getByRole('dialog', ({ name: 'Confirm Transfer' }));
    this.confirmTransferBtn = page.getByRole('button', ({ name: "Confirm Transfer" }));
    this.successHeading = page.getByTestId('transfer-success-heading');
    this.transferErrorMessage = page.getByTestId("transfer-error-message");
  }

  //Page action methods
  async goto(): Promise<void> {
    await this.navigateTo('bank/transfer');
    await this.waitForVisible(this.transferHeading);
  }

  //Form actions
  async selectFromAccount(optionName: string): Promise<void> {
    await this.click(this.fromAccountField);
    await this.click(this.page.getByRole('option', ({ name: optionName })));
  }

  async selectToAccount(optionName: string): Promise<void> {
    await this.click(this.toAccountField);
    await this.click(this.page.getByRole('option', ({ name: optionName })));
  }

  async fillAmount(value: string): Promise<void> {
    await this.fill(this.amountField, value);
  }

  async selectTodayOption(): Promise<void> {
    await this.click(this.todayRadioOption);
  }

  async sendTransfer(): Promise<void> {
    await this.click(this.sendTransferBtn);
    await this.waitForVisible(this.confirmDialog);
  }

  async confirmTransfer(): Promise<void> {
    await this.click(this.confirmTransferBtn);
    await this.assertURLContains('/bank/transfer/confirmation');
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.transferHeading);
  }

  async assertConfirmDialogVisible(): Promise<void> {
    await this.waitForVisible(this.confirmDialog);
  }

  async assertTransferSuccess(): Promise<void> {
    await this.assertURLContains('/bank/transfer/confirmation');
    await this.waitForVisible(this.successHeading);
  }

  async assertAccountFromAndToAccountNotEqual(optionName: string): Promise<void> {
    await this.click(this.toAccountField);
    await expect(this.page.getByRole('option', ({ name: optionName }))).toHaveCount(0);
  }
}