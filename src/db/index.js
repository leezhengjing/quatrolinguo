import PocketBase from 'pocketbase';

export const POCKET_BASE_URL = "https://quattro-lingo.pockethost.io/";

export class DatabaseClient {
    constructor() {
        this.client = new PocketBase(POCKET_BASE_URL);
        this.client.autoCancellation(false);
    }

    async authenticate(email, password) {
        try {
            const result = await this.client.collection("users").authWithPassword(email, password);
            console.log('authenticate result:', result);
            if (!result?.token) {
                throw new Error("Invalid email or password");
            }
            return result;
        } catch (err) {
            console.error(err);
            throw new Error("Invalid email or password");
        }
    }

    async register(email, password) {
        try {
            const result = await this.client.collection("users").create({
                email,
                password,
                passwordConfirm: password,
            });

            return result;
        } catch (err) {

        }
    }

    async isAuthenticated(cookieStore) {
        const cookie = cookieStore.get('pb_auth');
        if (!cookie) {
            return false;
        }

        this.client.authStore.loadFromCookie(cookie?.value || '');
        return this.client.authStore.isValid || false
    }

    async getUser(cookieStore) {
        const cookie = cookieStore.get('pb_auth');
        if (!cookie) {
            return false;
        }

        this.client.authStore.loadFromCookie(cookie?.value || '');
        return this.client.authStore.model;
    }
}

export const db = new DatabaseClient();

export default db;