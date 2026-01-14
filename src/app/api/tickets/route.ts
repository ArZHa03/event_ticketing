import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const tickets = db.getTickets();
        const sorted = [...tickets].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return NextResponse.json(sorted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const ticket = db.addTicket(name);
        return NextResponse.json(ticket);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }
}
