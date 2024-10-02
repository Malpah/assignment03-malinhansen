import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { DashboardPage } from './pages/dashboard-page';
import { RoomsPage } from './pages/rooms-page';
import { RoomCreatePage } from './pages/roomCreate-page';
import { BillsPage } from './pages/bills-page';
import { BillEditPage } from './pages/billEdit-page';
import { APIHelper } from './apiHelper';
import { DataGenerator } from './testData';

const test_username = `${process.env.TEST_USERNAME}`;
const test_password = `${process.env.TEST_PASSWORD}`;
const baseUrl = `${process.env.BASE_API_URL}`;

test.describe('frontend tests', () => {
  test('Test 1 - Create new room', async ({ page }) => {
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

  test('Test 2 - Edit a bill', async ({ page }) => {
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
  let apiHelper: APIHelper;
  let dataGenerator: DataGenerator;

  test.beforeAll('login, get access token', async ({ request }) => {
    apiHelper = new APIHelper(baseUrl);
    dataGenerator = new DataGenerator();
    const login = await apiHelper.login(request);
    expect(login.status()).toBe(200);
  });

  test('Test 1 - delete client', async ({ request }) => {
    const getClients = await apiHelper.getClients(request);
    const allClients = await getClients.json();
    const penultimateClientId = allClients[allClients.length - 2].id;

    const deleteClient = await apiHelper.deleteClient(request, penultimateClientId);
    expect(deleteClient.ok()).toBeTruthy();

    const getClientById = await apiHelper.getClientById(request, penultimateClientId);
    expect(getClientById.status()).toBe(401);
  });

  test('Test 2 - create reservation', async ({ request }) => {
    const getClients = await apiHelper.getClients(request);
    const clientsData = await getClients.json();
    let clientIds = clientsData.map(({ id }) => id);

    const getRooms = await apiHelper.getRooms(request);
    const roomsData = await getRooms.json();
    let roomIds = roomsData.map(({ id }) => id);

    const getBills = await apiHelper.getBills(request);
    const billsData = await getBills.json();
    let billIds = billsData.map(({ id }) => id);

    const payload = dataGenerator.generateReservationData(clientIds, roomIds, billIds);
    const createReservation = await apiHelper.createReservation(request, payload);
    expect(createReservation.ok()).toBeTruthy();
    expect(await createReservation.json()).toMatchObject(payload);

    const getReservations = await apiHelper.getReservations(request);
    expect(await getReservations.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining(payload),
      ])
    );
  });
});