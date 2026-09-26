import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SidebarComponent } from "./components/SidebarComponent";
import { parseCurrencyToNumber } from "../utils/currency";
import { expect } from "../fixtures/auth.fixture";

export class DashboardPage extends BasePage {

  //Locators
  private readonly dashboardHeading: Locator;
  private readonly netWorthBalance: Locator;
  readonly sidebar: SidebarComponent;
  private readonly recentTransactionsWidget: Locator;
  private readonly transactionRows: Locator;
  private readonly transactionDate: Locator;
  
  constructor(page: Page) {
    super(page);

    this.dashboardHeading = page.getByRole('heading', ({ name: 'Welcome back, Alex' }));
    this.netWorthBalance = page.getByTestId('stat-card-net-worth-value');
    this.sidebar = new SidebarComponent(page);
    this.recentTransactionsWidget = page.getByRole('region', ({ name: "Recent transactions" }));
    this.transactionRows = page.getByTestId('recent-txn-row');
    this.transactionDate = page.getByTestId('recent-txn-date');
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

  //Utilities
  async getRecentTransactionCount(): Promise<number> {
    await expect(this.transactionRows.first()).toBeVisible();
    return await this.transactionRows.count();
  }

  async getRecentTransactionDates(): Promise<Date[]> {
    await expect(this.transactionRows.first()).toBeVisible();
    const texts = await this.transactionDate.allTextContents();
    return texts.map((t) => {
        const d = new Date(t.trim());
        if (Number.isNaN(d.getTime())) {
          throw new Error(`Unparseable transaction date: "${t}"`);
        }
        return d;
    });
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.dashboardHeading);
    await this.assertVisible(this.netWorthBalance);
  }
}