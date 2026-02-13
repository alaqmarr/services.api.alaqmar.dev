import { Suspense } from 'react';
import { getDashboardStats, getUpcomingRenewals } from '@/lib/data';
import { DashboardStats } from '@/app/ui/dashboard/dashboard-stats';
import { UpcomingRenewals } from '@/app/ui/dashboard/upcoming-renewals';
import { Metadata } from 'next';
import Link from 'next/link';
import ClientTable from '@/app/ui/dashboard/client-table';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
    const stats = await getDashboardStats();
    const renewals = await getUpcomingRenewals();
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: { plan: true },
        take: 10, // Limit for dashboard view
    });

    return (
        <main className="w-full space-y-8">
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>

            <DashboardStats stats={stats} />

            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                <UpcomingRenewals renewals={renewals} />
                <div className="rounded-3xl bg-card-bg border border-card-border p-6 shadow-sm flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-foreground mb-2">Revenue Growth</h3>
                        <p className="text-secondary text-sm">Chart coming soon...</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4 pt-4">
                <h2 className="text-xl font-bold text-foreground">Recent Clients</h2>
                <Link
                    href="/dashboard/create"
                    className="flex h-11 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-semibold text-background shadow-lg shadow-foreground/10 transition-all hover:bg-black dark:hover:bg-white hover:scale-105"
                >
                    <span className="hidden md:block">Create New Client</span>
                    <span className="md:hidden">+ Add Client</span>
                </Link>
            </div>

            <ClientTable clients={clients.map(c => ({
                ...c,
                customPrice: Number(c.customPrice),
                amountPaid: Number(c.amountPaid),
                renewalPrice: Number(c.renewalPrice),
            }))} />
        </main>
    );
}
