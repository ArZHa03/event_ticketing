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

function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultData));
        return defaultData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

function writeDB(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
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
    }
};
