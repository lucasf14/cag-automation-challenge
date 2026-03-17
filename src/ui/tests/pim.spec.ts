import { test, expect } from '../fixtures/pagesFixture';
import { generateEmployee } from '../../utils/dataGenerator';

test('Navigate to PIM and verify the employee list is displayed', async ({ dashboardPage, pimPage, page }) => {
  await dashboardPage.goToPIM();
  await expect(page).toHaveURL(/pim/);
  await expect(pimPage.employeeTable).toBeVisible();
  await expect(pimPage.employeeRows.first()).toBeVisible();
  expect(await pimPage.employeeRows.count()).toBeGreaterThan(0);
});

test('Search for an employee', async ({ dashboardPage, pimPage }) => {
  const { firstName, lastName } = generateEmployee();
  await dashboardPage.goToPIM();
  await pimPage.searchEmployee(firstName, lastName);
  await pimPage.checkEmployeeSearchResults(firstName, lastName)
});

test('Add new employee and verify it appears in search', async ({ dashboardPage, pimPage }) => {
  const { firstName, lastName, id } = generateEmployee();
  await dashboardPage.goToPIM();
  await pimPage.addEmployee(firstName, lastName, id);
  await expect(pimPage.successToast).toBeVisible();
  await expect(pimPage.toastTitle).toHaveText('Success');
  await expect(pimPage.toastMessage).toHaveText('Successfully Saved');

  await pimPage.searchEmployee(firstName, lastName, id);
  await pimPage.checkEmployeeSearchResults(firstName, lastName, id)
});


test('Sidebar Validation', async ({ dashboardPage, page }) => {
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
