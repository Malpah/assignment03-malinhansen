import { type Locator, type Page } from '@playwright/test';

export class RoomsPage {
    readonly page: Page;
    readonly pageUrl: String;
    readonly pageHeading: Locator;
    readonly createRoomButton: Locator;
    readonly roomElements: Locator;
    readonly backButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.pageUrl = (`${process.env.BASE_URL}/rooms`);
        this.pageHeading = page.getByText('Rooms', {exact: true});
        this.createRoomButton = page.getByRole('link', { name: 'Create Room' });
        this.roomElements = page.locator('#app > div > div.rooms > div.card.room');
        this.backButton = page.getByRole('link', { name: 'Back' });
    };

    async goToCreateRoom() {
        await this.createRoomButton.click();
    };

    async goBackFromRoomsView() {
        await this.backButton.click();
    };
};