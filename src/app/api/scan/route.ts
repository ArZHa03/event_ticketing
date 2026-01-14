import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { qr_data } = body;

        if (!qr_data) {
            return NextResponse.json({ error: 'QR data is required' }, { status: 400 });
        }

        const ticket = db.getTicketById(qr_data);

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        if (ticket.status === 'REDEEMED') {
            return NextResponse.json({ error: 'Ticket already redeemed', ticket }, { status: 400 });
        }

        const updatedTicket = db.redeemTicket(qr_data);
        return NextResponse.json({ message: 'Success', ticket: updatedTicket });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to scan ticket' }, { status: 500 });
    }
}
