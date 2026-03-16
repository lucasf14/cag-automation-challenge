import { Page, Locator } from '@playwright/test';

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

  async addEmployee(firstName: string, lastName: string) {
    await this.addEmployeeButton.waitFor({ state: 'visible' });
    await this.addEmployeeButton.click();

    await this.firstNameInput.waitFor({ state: 'visible' });
    await this.lastNameInput.waitFor({ state: 'visible' });
    await this.employeeIdInput.waitFor({ state: 'visible' });
    await this.saveButton.waitFor({ state: 'visible' });
    const id = (await this.employeeIdInput.inputValue()).trim();
    console.log(`Predefined employee ID: ${id}`);

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);    
    await this.saveButton.click();

    console.log(`Created employee with ID: ${id}`);
    return id
  }

  async searchEmployee(name: string) {
    await this.employeeListButton.waitFor({ state: 'visible' });
    await this.employeeListButton.click();

    await this.employeeNameInput.waitFor({ state: 'visible' });
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
  }
  
  async searchEmployeeWithRetry(name: string, employeeId: string, maxRetries = 5) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await this.searchEmployee(name);
      await this.employeeRows.first().waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});

      const rowCount = await this.employeeRows.count();
      
      let found = false;
      for (let i = 0; i < rowCount; i++) {
        const rowText = await this.employeeRows.nth(i).textContent() || '';
        console.log(`Attempt ${attempt + 1} - Row ${i + 1}:`, rowText);
        if (rowText.includes(employeeId) && rowText.includes(name)) {
            found = true;
            break;
        }
      }

      if (found) return;

      await this.page.waitForTimeout(1000);
    }

    throw new Error(`Employee "${name}"  not found after ${maxRetries} retries`);
  }
}
