'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you created this
import Link from 'next/link';

type Ticket = {
  id: string;
  name: string;
  status: 'UNREDEEMED' | 'REDEEMED';
  createdAt: string;
  redeemedAt: string | null;
};

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', { cache: 'no-store' });
      const data = await res.json();
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Event Tickets</h1>
            <p className="text-slate-500">Public Guest List</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="text-sm font-medium text-blue-600 hover:underline">Admin</Link>
            <Link href="/scan" className="text-sm font-medium text-blue-600 hover:underline">Scanner</Link>
          </div>
        </header>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Guest List ({tickets.length})</h2>
            <button onClick={fetchTickets} className="p-2 hover:bg-slate-100 rounded-full transition">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center group"
                onClick={() => setSelectedTicket(ticket.id === selectedTicket?.id ? null : ticket)}
              >
                <div>
                  <div className="font-medium text-slate-900">{ticket.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{ticket.id.split('-')[0]}...</div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    ticket.status === 'REDEEMED' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  )}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && !loading && (
              <div className="p-8 text-center text-slate-500">No tickets found.</div>
            )}
          </div>
        </div>

        {/* Modal / Overlay for QR */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full space-y-6 text-center animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedTicket.name}</h3>
                <p className={cn("text-sm font-medium mt-2", selectedTicket.status === 'REDEEMED' ? "text-red-500" : "text-green-500")}>
                  {selectedTicket.status}
                </p>
              </div>

              <div className="flex justify-center p-4 bg-white rounded-xl border-2 border-slate-100">
                <QRCodeSVG value={selectedTicket.id} size={200} />
              </div>

              <p className="text-xs text-slate-400 font-mono select-all">
                {selectedTicket.id}
              </p>
            </div>
          </div>
        )}

        {/* API Docs */}
        <div className="bg-slate-100 rounded-xl p-6 text-sm text-slate-600 space-y-2">
          <h3 className="font-bold text-slate-800">Public Scan API Documentation</h3>
          <p>To redeem a ticket, send a POST request:</p>
          <div className="bg-slate-900 text-slate-50 p-3 rounded-lg font-mono text-xs overflow-x-auto">
            POST /api/scan<br />
            Content-Type: application/json<br />
            <br />
            {'{ "qr_data": "UUID_HERE" }'}
          </div>
        </div>

      </div>
    </div>
  );
}
