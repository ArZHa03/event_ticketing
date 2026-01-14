'use client';

import { useState } from 'react';
import { Loader2, ScanLine, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ScanPage() {
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputVal.trim()) return;

        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qr_data: inputVal.trim() }),
            });
            const data = await res.json();
            setResult({ success: res.ok, data });
        } catch (err) {
            setResult({ success: false, data: { error: 'Network Error' } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 font-sans flex flex-col items-center justify-center">
            <Link href="/" className="absolute top-4 left-4 text-slate-400 hover:text-white">
                ← Exit
            </Link>

            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                        <ScanLine size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Ticket Scanner</h1>
                    <p className="text-slate-400">Enter QR ID to simulate scan</p>
                </div>

                <form onSubmit={handleScan} className="space-y-4">
                    <input
                        type="text"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        placeholder="Paste Ticket ID / QR Data"
                        className="w-full bg-slate-800 border border-slate-700 text-center text-white py-4 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm placeholder:text-slate-600"
                    />
                    <button
                        disabled={loading || !inputVal}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Redeem Ticket"}
                    </button>
                </form>

                {result && (
                    <div className={cn(
                        "p-6 rounded-2xl text-center space-y-2 animate-in fade-in slide-in-from-bottom-4",
                        result.success ? "bg-green-500/10 border border-green-500/50 text-green-400" : "bg-red-500/10 border border-red-500/50 text-red-400"
                    )}>
                        {result.success ? (
                            <>
                                <CheckCircle2 size={40} className="mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">Valid Ticket!</div>
                                <div className="text-white/80">
                                    Validated for <span className="text-white font-bold">{result.data.ticket.name}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle size={40} className="mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">Action Failed</div>
                                <div className="text-white/80">{result.data.error}</div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
