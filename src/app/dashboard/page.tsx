import { prisma } from '@/lib/prisma';
import { signOut } from '@/auth';
import ClientTable from '@/app/ui/dashboard/client-table';
import RevenueWidget from '@/app/ui/dashboard/revenue-widget';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: { plan: true },
    });

    return (
        <div className="w-full space-y-8">
            <RevenueWidget />

            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-foreground">Clients</h1>
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
                amountPaid: Number(c.amountPaid)
            }))} />
        </div>
    );
}
