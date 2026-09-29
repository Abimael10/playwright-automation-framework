import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BillPayPage extends BasePage {
  private readonly billPageHeading: Locator;
  
  constructor(page: Page) {
    super(page);

    this.billPageHeading = page.getByRole('heading', ({ name: 'Pay a Bill' }));
  }

  //Assertions
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.billPageHeading);
    await this.assertURLContains('/bank/bill-pay');
  }
}