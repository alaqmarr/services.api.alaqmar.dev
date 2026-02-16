
import { Metadata } from 'next';
import Link from 'next/link';
import { getDashboardStats, getRecentTransactions, getUpcomingRenewals } from '@/lib/data';
import { DashboardStats } from '@/app/ui/dashboard/dashboard-stats';
import ClientGrid from '@/app/ui/dashboard/client-grid';
import { UpcomingRenewals } from '@/app/ui/dashboard/upcoming-renewals';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import PageHeader from '@/app/ui/page-header';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
    const stats = await getDashboardStats();
    const recentTransactions = await getRecentTransactions();
    const upcomingRenewals = await getUpcomingRenewals();
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            transactions: { orderBy: { createdAt: 'desc' }, take: 1 },
            plan: true
        },
    });

    return (
        <main className="w-full space-y-8">
            <PageHeader
                title="Dashboard"
                description="Overview of your business at a glance."
                actions={
                    <Link
                        href="/dashboard/create"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90 active:scale-[0.97]"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        <span className="hidden sm:inline">New Client</span>
                    </Link>
                }
            />

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="rounded-2xl bg-card-bg border border-card-border overflow-hidden h-full">
                    <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
                    </div>
                    <div className="divide-y divide-card-border">
                        {recentTransactions.length === 0 ? (
                            <div className="px-6 py-8 text-center text-sm text-secondary">No transactions yet.</div>
                        ) : (
                            recentTransactions.map((tx) => (
                                <div key={tx.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${tx.type === 'PAYMENT' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{tx.client?.name || 'Unknown'}</p>
                                            <p className="text-xs text-secondary">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-foreground">₹{Number(tx.amount).toLocaleString()}</p>
                                        <p className="text-xs text-secondary capitalize">{tx.type.toLowerCase()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Renewals */}
                <UpcomingRenewals renewals={upcomingRenewals} />
            </div>

            {/* Client List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground">Clients</h2>
                    <span className="text-xs text-secondary">{clients.length} total</span>
                </div>
                <ClientGrid clients={clients} />
            </div>
        </main>
    );
}
