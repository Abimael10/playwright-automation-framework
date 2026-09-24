import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransferPage extends BasePage {

  private readonly transferHeading: Locator;
  
  constructor(page: Page) {
    super(page);

    this.transferHeading = page.getByRole('heading', ({ name: 'Transfer Money' }));
  }

  async goto(): Promise<void> {
    await this.navigateTo('bank/transfer');
    await this.waitForVisible(this.transferHeading);
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.transferHeading);
  }
}