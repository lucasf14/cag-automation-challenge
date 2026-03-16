import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { PIMPage } from '../pages/pimPage';

type MyFixtures = {
  page: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PIMPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(process.env.UI_BASE_URL || '');
    await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');
    await use(loginPage);
  },

  dashboardPage: async ({ loginPage, page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  pimPage: async ({ page, dashboardPage }, use) => {
    const pimPage = new PIMPage(page);
    await use(pimPage);
  },
});

export { expect };
