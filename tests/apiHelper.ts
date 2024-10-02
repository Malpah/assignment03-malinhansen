import { APIRequestContext } from "@playwright/test";

export class APIHelper {
    private baseUrl: string;
    private username: string;
    private token: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Login section
    async login(request: APIRequestContext) {
        const response = await request.post(`${this.baseUrl}/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                username: `${process.env.TEST_USERNAME}`,
                password: `${process.env.TEST_PASSWORD}`
            })
        });
        const responseData = await response.json();
        this.username = responseData.username;
        this.token = responseData.token;
        return response;
    };


    // Rooms section
    async getRooms(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/rooms`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            }
        });
        return response;
    };


    // Clients section
    async getClients(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/clients`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            }
        });
        return response;
    };

    async getClientById(request: APIRequestContext, id: string) {
        const response = await request.get(`${this.baseUrl}/client/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            },
        });
        return response;
    };
    
    async deleteClient(request: APIRequestContext, id: string) {
        const response = await request.delete(`${this.baseUrl}/client/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            },
        });
        return response;
    };


    // Bills section
    async getBills(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/bills`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            }
        });
        return response;
    };


    // Reservation section
    async getReservations(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/reservations`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            }
        });
        return response;
    };

    async createReservation(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/reservation/new`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify({
                    username: this.username,
                    token: this.token
                })
            },
            data: JSON.stringify(payload)
        });
        return response;
    };
};