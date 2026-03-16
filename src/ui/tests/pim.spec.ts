import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { PIMPage } from '../pages/pimPage';

test('Navigate to PIM and verify the employee list is displayed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage = new PIMPage(page);

  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');
  await dashboardPage.goToPIM();

  await expect(page).toHaveURL(/pim/);
  await expect(pimPage.employeeTable).toBeVisible();
  await expect(pimPage.employeeRows.first()).toBeVisible();
  expect(await pimPage.employeeRows.count()).toBeGreaterThan(0);
});

test('Search for an employee', async ({ page }) => {
  const fullName = 'Nowhere To Be Found';
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage = new PIMPage(page);
  let rowCount = 0;
  let messageText = '';
  let found = false;

  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');
  await dashboardPage.goToPIM();

  for (let attempt = 0; attempt < 5; attempt++) {
    await pimPage.searchEmployee(fullName);

    await pimPage.searchResultsMessage.waitFor({ state: 'visible', timeout: 2000 });
    messageText = await pimPage.searchResultsMessage.textContent() || '';
    rowCount = await pimPage.employeeRows.count();

    if (messageText.includes('No Records Found') || rowCount > 0) break;

    await page.waitForTimeout(1000);
  }

  if (messageText.includes('No Records Found')) {
    expect(rowCount).toBe(0);
  } else {
    expect(messageText).toMatch(/\(\d+\) Records Found/);
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const rowText = await pimPage.employeeRows.nth(i).textContent() || '';
      if (rowText.includes(fullName)) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  }
});

test('Add new employee and verify it appears in search', async ({ page }) => {
  test.setTimeout(120000);
  const firstName = 'Lemmy';
  const lastName = 'Kilmister';
  const fullName = `${firstName} ${lastName}`;
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage = new PIMPage(page);

  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');
  await dashboardPage.goToPIM();

  const employeeId = await pimPage.addEmployee(firstName, lastName);
  await expect(pimPage.successToast).toBeVisible();
  await expect(pimPage.toastTitle).toHaveText('Success');
  await expect(pimPage.toastMessage).toHaveText('Successfully Saved');

  await pimPage.searchEmployeeWithRetry(fullName, employeeId);
});


test('Sidebar Validation', async ({ page }) => {
  test.setTimeout(120000);
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto(process.env.UI_BASE_URL || '');
  await loginPage.login(process.env.UI_USERNAME || '', process.env.UI_PASSWORD || '');

  await dashboardPage.goToAdmin();
  await expect(page).toHaveURL(/admin/);

  await dashboardPage.goToTime();
  await expect(page).toHaveURL(/time/);

  await dashboardPage.goToMyInfo();
  await expect(page).toHaveURL(/viewPersonalDetails/);

  await dashboardPage.goToDirectory();
  await expect(page).toHaveURL(/directory/);

  await dashboardPage.goToBuzz();
  await expect(page).toHaveURL(/buzz/);
});
