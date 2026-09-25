import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {

  //Locators
  private readonly dashboardHeading: Locator;
  
  constructor(page: Page) {
    super(page);

    this.dashboardHeading = page.getByRole('heading', ({ name: 'Welcome back, Alex' }));
  }

  //Actions
  async goto(): Promise<void> {
    await this.navigateTo('/bank/dashboard');
    await this.waitForVisible(this.dashboardHeading);
  }

  //Validations
  async assertLoaded(): Promise<void> {
    this.assertVisible(this.dashboardHeading);
  }
}