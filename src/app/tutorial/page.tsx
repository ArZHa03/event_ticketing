'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, Code, Smartphone, Zap, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function TutorialPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const CodeBlock = ({ code, id, title }: { code: string, id: string, title: string }) => (
        <div className="group relative bg-[#1e1e1e] rounded-xl overflow-hidden my-6 border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center px-4 py-2 bg-[#252526] border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">{title}</span>
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
                >
                    {copied === id ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-slate-400" />}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            {/* Header / Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={18} />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-blue-600" />
                        <span className="font-bold text-lg tracking-tight">Flutter Mastery</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12 space-y-20">
                {/* Hero */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                        <Zap size={14} />
                        Step-by-Step Guide
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-slate-900">
                        Build Your Own <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Event Scanner App</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        A beginner-friendly tutorial for students to master Flutter by building a real-world ticketing application with QR scanning and CRUD operations.
                    </p>

                    <div className="pt-8 flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-white rounded-[2rem] p-4 border border-slate-100 shadow-xl overflow-hidden max-w-sm">
                                <Image
                                    src="/assets/flutter_mockup.png"
                                    alt="Flutter App Preview"
                                    width={400}
                                    height={800}
                                    className="rounded-2xl"
                                />
                                <p className="mt-4 text-xs text-slate-400 font-medium uppercase tracking-widest">Target UI Design</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Sticky Sidebar */}
                    <aside className="hidden md:block md:col-span-3">
                        <div className="sticky top-28 space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">On this page</h3>
                            <nav className="flex flex-col space-y-1">
                                {['Prerequisites', 'The Model', 'API Service', 'Scanner Logic', 'UI Implementation'].map((item) => (
                                    <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all">
                                        {item}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="md:col-span-9 space-y-24">

                        {/* Section: Prerequisites */}
                        <section id="prerequisites" className="scroll-mt-32 space-y-6 text-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Smartphone size={20} /></div>
                                <h2 className="text-2xl font-bold text-slate-900">1. Getting Started</h2>
                            </div>
                            <p>First, create a new Flutter project and add these essential packages to your <code>pubspec.yaml</code>. These will handle networking, scanning, and UI components.</p>
                            <CodeBlock
                                id="pubspec"
                                title="pubspec.yaml"
                                code={`dependencies:
  flutter:
    sdk: flutter
  dio: ^5.4.0              # For API requests
  mobile_scanner: ^5.0.0   # For QR scanning
  intl: ^0.19.0            # For date formatting
  qr_flutter: ^4.1.0        # For generating QR codes`}
                            />
                        </section>

                        {/* Section: The Model */}
                        <section id="the-model" className="scroll-mt-32 space-y-6 text-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><BookOpen size={20} /></div>
                                <h2 className="text-2xl font-bold text-slate-900">2. Define the Ticket Model</h2>
                            </div>
                            <p>Create a class that reflects the data structure from our API. This makes it easy to work with ticket objects in Dart.</p>
                            <CodeBlock
                                id="model"
                                title="lib/models/ticket.dart"
                                code={`class Ticket {
  final String id;
  final String name;
  final String status;
  final DateTime createdAt;
  final DateTime? redeemedAt;

  Ticket({
    required this.id,
    required this.name,
    required this.status,
    required this.createdAt,
    this.redeemedAt,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      id: json['id'],
      name: json['name'],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      redeemedAt: json['redeemedAt'] != null 
          ? DateTime.parse(json['redeemedAt']) 
          : null,
    );
  }
}`}
                            />
                        </section>

                        {/* Section: API Service */}
                        <section id="api-service" className="scroll-mt-32 space-y-6 text-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Zap size={20} /></div>
                                <h2 className="text-2xl font-bold text-slate-900">3. Create the API Service</h2>
                            </div>
                            <p>This service will communicate with your Next.js backend. Replace <code>YOUR_API_URL</code> with your Vercel deployment URL.</p>
                            <CodeBlock
                                id="service"
                                title="lib/services/api_service.dart"
                                code={`import 'package:dio/dio.dart';
import '../models/ticket.dart';

class ApiService {
  final _dio = Dio(BaseOptions(baseUrl: 'https://event-ticketing-ruddy.vercel.app/api'));

  Future<List<Ticket>> getTickets() async {
    final response = await _dio.get('/tickets');
    return (response.data as List).map((t) => Ticket.fromJson(t)).toList();
  }

  Future<void> addTicket(String name) async {
    await _dio.post('/tickets', data: {'name': name});
  }

  Future<void> deleteTicket(String id) async {
    await _dio.delete('/tickets', queryParameters: {'id': id});
  }

  Future<void> scanTicket(String qrData) async {
    await _dio.post('/scan', data: {'qr_data': qrData});
  }
}`}
                            />
                        </section>

                        {/* Section: UI Implementation */}
                        <section id="ui-implementation" className="scroll-mt-32 space-y-10 text-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><Smartphone size={20} /></div>
                                <h2 className="text-2xl font-bold text-slate-900">5. Connecting Logic to UI</h2>
                            </div>
                            <p>This is where everything comes together! We will create a <code>StatefulWidget</code> that uses our <code>ApiService</code> to fetch and display tickets.</p>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-slate-800">The Home Page State</h3>
                                <p>We need to manage the list of tickets and a loading state. We'll use <code>initState</code> to fetch data when the app starts.</p>
                                <CodeBlock
                                    id="ui-state"
                                    title="lib/views/home_page.dart (Part 1)"
                                    code={`class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ApiService _api = ApiService();
  List<Ticket> _tickets = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _refreshTickets();
  }

  Future<void> _refreshTickets() async {
    setState(() => _isLoading = true);
    try {
      final data = await _api.getTickets();
      setState(() => _tickets = data);
    } finally {
      setState(() => _isLoading = false);
    }
  }
}`} />
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-slate-800">Building the List View</h3>
                                <p>We'll use a <code>ListView.builder</code> to display the tickets and a <code>FloatingActionButton</code> to navigate to the scanner.</p>
                                <CodeBlock
                                    id="ui-build"
                                    title="lib/views/home_page.dart (Part 2)"
                                    code={`@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text('Event Scanner')),
    body: _isLoading 
      ? Center(child: CircularProgress() )
      : RefreshIndicator(
          onRefresh: _refreshTickets,
          child: ListView.builder(
            itemCount: _tickets.length,
            itemBuilder: (context, index) {
              final ticket = _tickets[index];
              return ListTile(
                title: Text(ticket.name),
                subtitle: Text(ticket.status),
                trailing: IconButton(
                  icon: Icon(Icons.delete, color: Colors.red),
                  onPressed: () => _deleteTicket(ticket.id),
                ),
              );
            },
          ),
        ),
    floatingActionButton: FloatingActionButton(
      child: Icon(Icons.qr_code_scanner),
      onPressed: () => Navigator.push(
        context, 
        MaterialPageRoute(builder: (_) => ScannerPage())
      ).then((_) => _refreshTickets()), // Refresh when coming back!
    ),
  );
}`} />
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-slate-800">Important: How to Delete</h3>
                                <p>To delete a ticket, call the service and then refresh the local state so the item disappears immediately.</p>
                                <CodeBlock
                                    id="ui-delete"
                                    title="lib/views/home_page.dart (Logic)"
                                    code={`Future<void> _deleteTicket(String id) async {
  await _api.deleteTicket(id);
  _refreshTickets(); // Simple way: fetch everything again
  // Or: setState(() => _tickets.removeWhere((t) => t.id == id));
}`} />
                            </div>
                        </section>

                        {/* Conclusion */}
                        <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-6">
                            <h2 className="text-3xl font-bold">You're ready to build!</h2>
                            <p className="text-slate-400">
                                This tutorial covers the core architecture. You can now design your own UI, add loading states, and handle errors to make the app feel professional.
                            </p>
                            <div className="pt-4">
                                <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25">
                                    Done? Return to Guest List
                                    <ArrowLeft size={18} className="rotate-180" />
                                </Link>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 py-12 text-center text-slate-400 text-sm">
                &copy; 2026 Event Ticketing Tutorial Project
            </footer>
        </div>
    );
}
