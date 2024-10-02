import { faker } from "@faker-js/faker";

export class DataGenerator {
    // Reservations section
    generateReservationData = (clientIds: Array<string>, roomIds: Array<string>, billIds: Array<string>) => {
        const clientId = Math.floor(Math.random() * clientIds.length);
        const roomId = Math.floor(Math.random() * roomIds.length);
        const billId = Math.floor(Math.random() * billIds.length);
        const startDate = faker.date.soon({ days: 365 }).toLocaleDateString();
        const endDate = faker.date.soon({ days: 10, refDate: startDate }).toLocaleDateString();

        return {
            client: clientIds[clientId],
            room: roomIds[roomId],
            bill: billIds[billId],
            start: startDate,
            end: endDate
        };
    };
};