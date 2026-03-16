import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly errorMessage: Locator;
  readonly usernameContainer: Locator;
  readonly passwordContainer: Locator;
  readonly usernameRequired: Locator;
  readonly passwordRequired: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.userDropdown = page.locator('.oxd-userdropdown-name');
    this.logoutButton = page.locator('.oxd-userdropdown-link', { hasText: 'Logout' });
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.usernameContainer = page.locator('.oxd-input-group', { hasText: 'Username' });
    this.passwordContainer = page.locator('.oxd-input-group', { hasText: 'Password' });
    this.usernameRequired = this.usernameContainer.locator('.oxd-input-field-error-message');
    this.passwordRequired = this.passwordContainer.locator('.oxd-input-field-error-message');
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async fillInput(input: Locator, text: string) {
    await input.waitFor({ state: 'visible' });
    await input.fill(text);
  }

  async clickButton(button: Locator) {
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  async login(username: string, password: string) {
    await this.fillInput(this.username, username);
    await this.fillInput(this.password, password);
    await this.clickButton(this.loginButton);
  }

  async logout() {
    await this.clickButton(this.userDropdown);
    await this.clickButton(this.logoutButton);
  }
}
