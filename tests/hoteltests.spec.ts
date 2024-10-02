import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { RoomsPage } from './pages/rooms-page';
import { RoomCreatePage } from './pages/roomCreate-page';
import { BillsPage } from './pages/bills-page';
import { BillEditPage } from './pages/billEdit-page';

const test_username: any = process.env.TEST_USERNAME;
const test_password: any = process.env.TEST_PASSWORD;

test.describe('frontend tests', () => {
  test('Test 1 - Perform login and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await expect(loginPage.usernameInputField).toBeEmpty();
    await expect(loginPage.passwordInputField).toBeEmpty();
    expect(page.url()).toBe(loginPage.pageUrl);

    await loginPage.performLogin(test_username, test_password);
    await expect(dashboardPage.welcomeMessageUser).toContainText(test_username);
    await expect(dashboardPage.pageHeading).toBeVisible();

    await dashboardPage.performLogout();
    await expect(loginPage.pageHeading).toBeVisible();
    expect(page.url()).toBe(loginPage.pageUrl);
  });

  test('Test 2 - Create new room', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const roomsPage = new RoomsPage(page);
    const roomCreatePage = new RoomCreatePage(page);

    await loginPage.goto();
    await loginPage.performLogin(test_username, test_password);

    await dashboardPage.goToRoomView();
    const roomsBeforeCreate = await roomsPage.roomElements.count();

    await roomsPage.goToCreateRoom();
    await expect(roomCreatePage.pageHeading).toBeVisible();
    expect(roomCreatePage.pageUrl).toBe(page.url());
    await expect(roomCreatePage.numberInputField).toBeEmpty();
    await expect(roomCreatePage.floorInputField).toBeEmpty();
    await expect(roomCreatePage.availableCheckbox).toBeEmpty();
    await expect(roomCreatePage.priceInputField).toBeEmpty();

    await roomCreatePage.createNewRoom();
    await expect(roomsPage.backButton).toBeVisible();
    const roomsAfterCreate = await roomsPage.roomElements.count();
    expect(roomsAfterCreate - roomsBeforeCreate).toEqual(1);

    await dashboardPage.performLogout();
  });

  test('Test 3 - Edit a bill', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const billsPage = new BillsPage(page);
    const billEditPage = new BillEditPage(page);

    await loginPage.goto();
    await loginPage.performLogin(test_username, test_password);

    await dashboardPage.goToBillsView();
    const firstBillBeforeEdit = await billsPage.firstBillInList.allTextContents();

    await billsPage.goToEditBill();
    await expect(billEditPage.pageHeading).toBeVisible();
    await expect(page.url()).toContain(billEditPage.pageUrl);
    await billEditPage.editBill();

    await expect(billsPage.backButton).toBeVisible();
    const firstBillAfterEdit = await billsPage.firstBillInList.allTextContents();
    await expect(firstBillAfterEdit).not.toBe(firstBillBeforeEdit);
    await expect(billsPage.createBillButton).toBeVisible();

    await dashboardPage.performLogout();
  });
});

test.describe('backend tests', () => {
  test('get started link', async ({ page }) => {

  });
});