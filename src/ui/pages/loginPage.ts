import { Page } from '@playwright/test';

export class LoginPage {
  private selectors = {
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    loginButton: 'button[type="submit"]',
  };

  constructor(private page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }
  
  async fillInput(selector: string, text: string) {
    const field = this.page.locator(selector);
    await field.waitFor({ state: 'visible' });
    await field.fill(text);
  }

  async clickButton(selector: string) {
    const button = this.page.locator(selector);
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  async login(username: string, password: string) {
    await this.fillInput(this.selectors.username, username);
    await this.fillInput(this.selectors.password, password);
    await this.clickButton(this.selectors.loginButton);
  }
}
