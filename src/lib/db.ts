import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const DB_PATH = path.join(DATA_DIR, 'db.json');

export type Ticket = {
    id: string;
    name: string;
    status: 'UNREDEEMED' | 'REDEEMED';
    createdAt: string;
    redeemedAt: string | null;
};

const defaultData: { tickets: Ticket[] } = { tickets: [] };

// In-memory cache to persist data during the "warm" time of a Vercel lambda instance.
// WARNING: This is NOT a permanent database. Data will still be lost when the lambda cold starts.
let cachedData: { tickets: Ticket[] } | null = null;

function readDB() {
    if (cachedData) return cachedData;

    try {
        if (!fs.existsSync(DB_PATH)) {
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
            }
            fs.writeFileSync(DB_PATH, JSON.stringify(defaultData));
            cachedData = defaultData;
            return defaultData;
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        cachedData = JSON.parse(data);
        return cachedData!;
    } catch (e) {
        return cachedData || defaultData;
    }
}

function writeDB(data: any) {
    cachedData = data;
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('DATABASE_WRITE_ERROR: Failed to write to db.json. This is expected on Vercel/Serverless environments if not using an external DB.', error);
        // On Vercel, data will be lost when the lambda cold starts.
        // For a permanent fix, the user should connect a real database.
    }
}

export const db = {
    getTickets: () => readDB().tickets,
    getTicketById: (id: string) => readDB().tickets.find((t: Ticket) => t.id === id),
    addTicket: (name: string) => {
        const data = readDB();
        const newTicket: Ticket = {
            id: randomUUID(),
            name,
            status: 'UNREDEEMED',
            createdAt: new Date().toISOString(),
            redeemedAt: null,
        };
        data.tickets.push(newTicket);
        writeDB(data);
        return newTicket;
    },
    redeemTicket: (id: string) => {
        const data = readDB();
        const index = data.tickets.findIndex((t: Ticket) => t.id === id);
        if (index === -1) return null;

        if (data.tickets[index].status === 'REDEEMED') return data.tickets[index];

        data.tickets[index].status = 'REDEEMED';
        data.tickets[index].redeemedAt = new Date().toISOString();
        writeDB(data);
        return data.tickets[index];
    },
    deleteTicket: (id: string) => {
        const data = readDB();
        const index = data.tickets.findIndex((t: Ticket) => t.id === id);
        if (index === -1) return false;

        data.tickets.splice(index, 1);
        writeDB(data);
        return true;
    }
};
