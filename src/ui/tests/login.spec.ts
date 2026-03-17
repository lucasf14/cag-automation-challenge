import { test, expect } from '../fixtures/pagesFixture';
import { LoginPage } from '../pages/loginPage';

test('Successful login', async ({ dashboardPage, page }) => {
  await expect(page).toHaveURL(/dashboard/);
  await expect(dashboardPage.title).toBeVisible();
  await expect(dashboardPage.title).toHaveText('Dashboard');
  await expect(dashboardPage.sidePanel).toBeVisible();
  await expect(dashboardPage.dashboardGrid).toBeVisible();
  await expect(dashboardPage.widgets.first()).toBeVisible();
  expect(await dashboardPage.widgets.count()).toBeGreaterThan(0);
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
  await expect(loginPage.usernameContainer).toHaveScreenshot('test-results/login-empty-username.png', { maxDiffPixelRatio: 0.05 });
});

test('Successful login, logout and redirect to login page', async ({ loginPage, page }) => {
  await expect(page).toHaveURL(/dashboard/);

  await loginPage.logout();
  await expect(page).toHaveURL(/auth\/login/);

  await expect(loginPage.username).toHaveValue('');
  await expect(loginPage.password).toHaveValue('');
});
