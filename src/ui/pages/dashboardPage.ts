import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly dashboardGrid: Locator;
  readonly sidePanel: Locator;
  readonly widgets: Locator;
  readonly quickLaunchWidget: Locator;
  readonly quickLaunchWidgetItems: Locator;

  // Side panel locators
  readonly admin: Locator;
  readonly pim: Locator;
  readonly leave: Locator;
  readonly time: Locator;
  readonly recruitment: Locator;
  readonly myInfo: Locator;
  readonly performance: Locator;
  readonly dashboard: Locator;
  readonly directory: Locator
  readonly maintenance: Locator;
  readonly claim: Locator;
  readonly buzz: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.oxd-topbar-header-title');
    this.dashboardGrid = page.locator('.orangehrm-dashboard-grid');
    this.sidePanel = page.locator('.oxd-sidepanel');
    this.widgets = page.locator('.orangehrm-dashboard-widget');
    this.quickLaunchWidget = page.locator('.orangehrm-quick-launch');
    this.quickLaunchWidgetItems = this.quickLaunchWidget.locator('.orangehrm-quick-launch-card');
    this.admin = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Admin' });
    this.pim = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'PIM' });
    this.leave = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Leave' });
    this.time = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Time' });
    this.recruitment = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Recruitment' });
    this.myInfo = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'My Info' });
    this.performance = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Performance' });
    this.dashboard = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Dashboard' });
    this.directory = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Directory' });
    this.maintenance = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Maintenance' });
    this.claim = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Claim' });
    this.buzz = this.sidePanel.locator('.oxd-main-menu-item', { hasText: 'Buzz' });
  }

  async goToAdmin() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.admin.waitFor({ state: 'visible' });
    await this.admin.click();
  }

  async goToPIM() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.pim.waitFor({ state: 'visible' });
    await this.pim.click();
  }

  async goToLeave() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.leave.waitFor({ state: 'visible' });
    await this.leave.click();
  }

  async goToTime() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.time.waitFor({ state: 'visible' });
    await this.time.click();
  }

  async goToRecruitment() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.recruitment.waitFor({ state: 'visible' });
    await this.recruitment.click();
  }

  async goToMyInfo() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.myInfo.waitFor({ state: 'visible' });
    await this.myInfo.click();
  } 
  
  async goToPerformance() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.performance.waitFor({ state: 'visible' });
    await this.performance.click();
  }

  async goToDirectory() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.directory.waitFor({ state: 'visible' });
    await this.directory.click();
  }

  async goToMaintenance() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.maintenance.waitFor({ state: 'visible' });
    await this.maintenance.click();
  }

  async goToClaim() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.claim.waitFor({ state: 'visible' });
    await this.claim.click();
  }

  async goToBuzz() {
    await this.sidePanel.waitFor({ state: 'visible' });
    await this.buzz.waitFor({ state: 'visible' });
    await this.buzz.click();
  }
}
