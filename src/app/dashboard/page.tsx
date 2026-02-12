import { prisma } from '@/lib/prisma';
import { signOut } from '@/auth';
import ClientTable from '@/app/ui/dashboard/client-table';
import RevenueWidget from '@/app/ui/dashboard/revenue-widget';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="w-full space-y-8">
            <RevenueWidget />

            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[#2d2a26] dark:text-[#fdfcf8]">Clients</h1>
                <Link
                    href="/dashboard/create"
                    className="flex h-11 items-center justify-center rounded-xl bg-[#1c1917] dark:bg-[#fdfcf8] px-6 text-sm font-semibold text-[#fdfcf8] dark:text-[#1c1917] shadow-lg shadow-[#1c1917]/10 transition-all hover:bg-[#2d2a26] hover:scale-105"
                >
                    <span className="hidden md:block">Create New Client</span>
                    <span className="md:hidden">+ Add Client</span>
                </Link>
            </div>

            <div className="bg-white/40 dark:bg-white/5 rounded-3xl shadow-sm border border-[#e5e5e5] dark:border-white/5 overflow-hidden backdrop-blur-sm">
                <ClientTable clients={clients} />
            </div>
        </div>
    );
}
