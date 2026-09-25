import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SidebarComponent } from "./components/SidebarComponent";
import { parseCurrencyToNumber } from "../utils/currency";

export class DashboardPage extends BasePage {

  //Locators
  private readonly dashboardHeading: Locator;
  private readonly netWorthBalance: Locator;
  readonly sidebar: SidebarComponent;
  
  constructor(page: Page) {
    super(page);

    this.dashboardHeading = page.getByRole('heading', ({ name: 'Welcome back, Alex' }));
    this.netWorthBalance = page.getByTestId('stat-card-net-worth-value');
    this.sidebar = new SidebarComponent(page);
  }

  //Actions
  async goto(): Promise<void> {
    await this.navigateTo('/bank/dashboard');
    await this.waitForVisible(this.dashboardHeading);
  }

  async fromDashboardGotoAccounts(): Promise<void> {
    await this.sidebar.gotoAccounts();
  }

  async getNetWorthValue(): Promise<number> {
    await this.assertVisible(this.netWorthBalance);
    const text = await this.netWorthBalance.textContent();
    return parseCurrencyToNumber(text ?? "");
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.dashboardHeading);
    await this.assertVisible(this.netWorthBalance);
  }
}