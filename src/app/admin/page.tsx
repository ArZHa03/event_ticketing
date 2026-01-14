'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastTicket, setLastTicket] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (res.ok) {
                setLastTicket(data);
                setName('');
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Failed to generate ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
            <div className="max-w-md mx-auto space-y-6">
                <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
                    ← Back to Guest List
                </Link>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Ticket Generator</h1>
                    <p className="text-slate-500">Create new tickets for guests.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name (e.g. John Doe)"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                    <button
                        disabled={loading || !name.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                        Generate Ticket
                    </button>
                </form>

                {lastTicket && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4">
                        <div className="text-center space-y-4">
                            <div className="text-green-800 font-bold text-lg">Ticket Generated!</div>
                            <div className="flex justify-center bg-white p-4 rounded-xl inline-block shadow-sm">
                                <QRCodeSVG value={lastTicket.id} size={150} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-xl">{lastTicket.name}</div>
                                <div className="text-xs text-slate-400 font-mono">{lastTicket.id}</div>
                            </div>
                            <button onClick={() => setLastTicket(null)} className="text-sm text-green-700 underline">
                                Clear & Create Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
