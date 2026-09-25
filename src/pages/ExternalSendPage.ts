import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ExternalSendPage extends BasePage {
  //Locators
  private readonly sendMoneyHeading: Locator;
  
  constructor(page: Page) {
    super(page);

    this.sendMoneyHeading = page.getByRole('heading', ({ name: 'Send Money' }));
  }

  //Actions
  async goto(): Promise<void> {
    await this.navigateTo("/bank/send-money");
    await this.waitForVisible(this.sendMoneyHeading);
  }

  //Assertions
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.sendMoneyHeading);
  }
}