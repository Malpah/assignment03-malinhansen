import { type Locator, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class RoomCreatePage {
    readonly page: Page;
    readonly pageUrl: String;
    readonly pageHeading: Locator;
    readonly categoryOptions: Locator;
    readonly numberInputField: Locator;
    readonly floorInputField: Locator;
    readonly availableCheckbox: Locator;
    readonly priceInputField: Locator;
    readonly featuresMultipleOptions: Locator;
    readonly backButton: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageUrl = (`${process.env.BASE_URL}/room/new`);
        this.pageHeading = page.getByText('New Room', { exact: true });
        this.categoryOptions = page.getByRole('combobox');
        this.numberInputField = page.locator('div').filter({ hasText: /^Number$/ }).getByRole('spinbutton');
        this.floorInputField = page.locator('div').filter({ hasText: /^Floor$/ }).getByRole('spinbutton');
        this.availableCheckbox = page.locator('.checkbox');
        this.priceInputField = page.locator('div').filter({ hasText: /^Price$/ }).getByRole('spinbutton');
        this.featuresMultipleOptions = page.getByRole('listbox');
        this.backButton = page.getByRole('link', { name: 'Back' });
        this.saveButton = page.getByText('Save');
    };

    async createNewRoom() {
        let floorNumber = faker.number.int({ min: 1, max: 20 }).toString();
        let roomNumber = faker.number.int({ min: 1, max: 9 }).toString();
        let roomPrice = faker.finance.amount({ min: 1000, max: 30000, dec: 0 });

        const typeOptions = await this.categoryOptions.locator('option').allInnerTexts();
        const numberOfTypeOptions = typeOptions.length;
        const randomType = faker.number.int({ min: 0, max: (numberOfTypeOptions - 1) });
        await this.categoryOptions.selectOption(typeOptions[randomType].trim());

        await this.numberInputField.fill(floorNumber + 0 + roomNumber);
        await this.floorInputField.fill(floorNumber);
        await this.availableCheckbox.click();
        await this.priceInputField.fill(roomPrice);

        let featureOptions = await this.featuresMultipleOptions.locator('option').allInnerTexts();
        const numberOfFeatureOptions = featureOptions.length;
        let numberOfFeatures = faker.number.int({ min: 1, max: numberOfFeatureOptions });
        let roomFeatures: any[] = [];
        for (let i = 0; i < (numberOfFeatures); i++) {
            let randomFeature = faker.number.int({ min: 0, max: (featureOptions.length-1) });
            roomFeatures.push(featureOptions[randomFeature]);
            featureOptions.splice(randomFeature, 1);
        };
        await this.featuresMultipleOptions.selectOption(roomFeatures);
        
        await this.saveButton.click();
    };

    async goBackFromCreateNewRoom() {
        await this.backButton.click();
    };
};