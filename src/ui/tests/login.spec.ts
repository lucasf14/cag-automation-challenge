import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';

test('Successful login', async ({ page }) => {  
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');

  await expect(page).toHaveURL(/dashboard/);
  await expect(dashboardPage.title).toBeVisible();
  await expect(dashboardPage.title).toHaveText('Dashboard');
  await expect(dashboardPage.sidePanel).toBeVisible();
  await expect(dashboardPage.dashboard).toBeVisible();
  await expect(dashboardPage.widgets.first()).toBeVisible();
  expect(await dashboardPage.widgets.count()).toBeGreaterThan(1);
});


test('Unsuccessful login with invalid credentials', async ({ page }) => {  
  const loginPage = new LoginPage(page);
  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login('qwerty', '123456');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
});


test('Unsuccessful login with empty fields', async ({ page }) => {  
  const loginPage = new LoginPage(page);
  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login('', '');

  await expect(loginPage.usernameRequired).toHaveText('Required');
  await expect(loginPage.passwordRequired).toHaveText('Required');
});


test('Successful login, logout and redirect to login page', async ({ page }) => {  
  const loginPage = new LoginPage(page);
  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');
  await expect(page).toHaveURL(/dashboard/);

  await loginPage.logout();
  await expect(page).toHaveURL(/auth\/login/);

  await expect(loginPage.username).toHaveValue('');
  await expect(loginPage.password).toHaveValue('');
});
