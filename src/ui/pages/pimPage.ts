import { Page, Locator, expect } from '@playwright/test';

export class PIMPage {
  readonly page: Page;
  readonly employeeTable: Locator;
  readonly employeeRows: Locator;
  readonly employeeListButton: Locator;
  readonly addEmployeeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeNameInput: Locator;
  readonly employeeNameElement: Locator;
  readonly employeeIdElement: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly searchButton: Locator;
  readonly searchResultsMessage: Locator;
  readonly successToast: Locator;
  readonly toastTitle: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeTable = page.locator('.oxd-table');
    this.employeeRows = page.locator('.oxd-table-body .oxd-table-row');
    this.employeeListButton = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Employee List' });
    this.employeeNameElement = page.locator('.oxd-input-group', { hasText: 'Employee Name' });
    this.employeeNameInput = this.employeeNameElement.locator('[placeholder="Type for hints..."]');
    this.employeeIdElement = page.locator('.oxd-input-group', { hasText: 'Employee Id' });
    this.employeeIdInput = this.employeeIdElement.locator('.oxd-input');
    this.searchButton = page.locator('button[type="submit"]', { hasText: 'Search' });
    this.searchResultsMessage = page.locator('.orangehrm-horizontal-padding .oxd-text--span');
    this.addEmployeeButton = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Add Employee' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.saveButton = page.locator('button[type="submit"]', { hasText: 'Save' });
    this.successToast = page.locator('.oxd-toast--success');
    this.toastTitle = this.successToast.locator('.oxd-text--toast-title');
    this.toastMessage = this.successToast.locator('.oxd-text--toast-message');
  }

  async addEmployee(firstName: string, lastName: string, id: string) {
    await this.addEmployeeButton.waitFor({ state: 'visible' });
    await this.addEmployeeButton.click();

    await this.firstNameInput.waitFor({ state: 'visible' });
    await this.lastNameInput.waitFor({ state: 'visible' });
    await this.employeeIdInput.waitFor({ state: 'visible' });
    await this.saveButton.waitFor({ state: 'visible' });

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.fill(id);
    await this.saveButton.click();
  }

  async searchEmployee(firstName: string, lastName: string, id?: string) {
    const fullName = `${firstName}  ${lastName}`;
    await this.employeeListButton.waitFor({ state: 'visible' });
    await this.employeeListButton.click();

    await this.employeeNameInput.waitFor({ state: 'visible' });
    await this.employeeNameInput.fill(fullName);

    if (id) {
      await this.employeeIdInput.waitFor({ state: 'visible' });
      await this.employeeIdInput.fill(id);
    }

    const recordsBeforeSearch = (await this.searchResultsMessage.textContent())?.trim() || '';
    await this.searchButton.click();
    await expect(this.searchResultsMessage).not.toHaveText(recordsBeforeSearch, { timeout: 5000 });
  }

  async checkEmployeeSearchResults(firstName: string, lastName: string, id?: string, maxRetries = 5) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const messageText = (await this.searchResultsMessage.textContent())?.trim() || '';
      const rowCount = await this.employeeRows.count();

      if (messageText.includes('No Records Found')) {
        expect(rowCount).toBe(0);
        return;
      } else {
        expect(rowCount).toBeGreaterThan(0);
        let found = false;
        for (let i = 0; i < rowCount; i++) {
          const rowText = (await this.employeeRows.nth(i).textContent()) || '';
          if (id) {
            if (rowText.includes(firstName) && rowText.includes(lastName) && rowText.includes(id)) {
              found = true;
              break;
            }
          } else {
            if (rowText.includes(firstName) && rowText.includes(lastName)) {
              found = true;
              break;
            }
          }
        }
        if (found) return;
      }
      await this.page.waitForTimeout(1000);
    }
    throw new Error(`Employee "${firstName} ${lastName}"${id ? ` with ID ${id}` : ''} not found after ${maxRetries} retries`);
  }
}
