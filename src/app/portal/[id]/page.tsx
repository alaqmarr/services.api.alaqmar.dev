
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            transactions: { orderBy: { createdAt: 'desc' } }
        }
    });

    if (!client) notFound();

    return (
        <div className="min-h-screen bg-background font-sans text-foreground p-6 md:p-12 flex justify-center">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                        ❄️
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {client.name}</h1>
                    {client.domain && <p className="text-secondary">{client.domain}</p>}
                </div>

                {/* Status Card */}
                <div className="bg-card-bg rounded-3xl border border-card-border p-8 shadow-sm text-center">
                    <p className="text-sm text-secondary uppercase tracking-wider font-semibold mb-2">Total Paid</p>
                    <div className="text-5xl font-bold tracking-tight text-foreground">
                        ₹{client.transactions
                            .filter(t => t.type === 'PAYMENT') // Filter by PAYMENT type
                            .reduce((sum, t) => sum + Number(t.amount), 0)
                            .toLocaleString()}
                    </div>
                </div>

                {/* Transactions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold px-2">Payment History</h3>
                    <div className="bg-card-bg rounded-3xl border border-card-border overflow-hidden">
                        <div className="divide-y divide-card-border">
                            {client.transactions.length === 0 ? (
                                <div className="p-8 text-center text-secondary text-sm">No transactions found.</div>
                            ) : (
                                client.transactions.map(tx => (
                                    <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'PAYMENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {tx.type === 'PAYMENT' ? '✓' : '⟲'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">Payment</p>
                                                <p className="text-xs text-secondary">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">₹{Number(tx.amount).toLocaleString()}</p>
                                            <p className="text-xs text-secondary capitalize">{tx.type.toLowerCase()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8 text-xs text-secondary/40">
                    <p>Alaqmar Services Client Portal • {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}
