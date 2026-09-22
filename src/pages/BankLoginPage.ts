import {Page, Locator} from "@playwright/test"
import {BasePage} from "./BasePage"

export class BankLoginPage extends BasePage {
  //Define locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    //Inherit page from BasePage
    super(page);

    //Initialize locators with their values
    this.usernameInput = page.getByRole('textbox', ({name: 'Username'}));
    this.passwordInput = page.getByRole('textbox', ({name: 'Password'}));
    this.loginButton = page.getByRole('button', ({name: "Sign in to SecureBank"}));
  }

  //Page action methods to be used in tests steps
  async goto(): Promise<void> {
    await this.navigateTo('bank/login');
    await this.waitForVisible(this.usernameInput);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  //Validations
  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.usernameInput);
    await this.assertVisible(this.passwordInput);
    await this.assertVisible(this.loginButton);
  }

  async assertTitleContains(expected: string | RegExp): Promise<void> {
    await this.assertTitle(expected);
  }
}