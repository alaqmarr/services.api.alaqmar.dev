import { prisma } from '@/lib/prisma';
import { signOut } from '@/auth';
import ClientTable from '@/app/ui/dashboard/client-table';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <Link
                    href="/dashboard/create"
                    className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <span className="hidden md:block">Create Client</span>
                    <span className="md:hidden">+</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ClientTable clients={clients} />
            </div>
        </div>
    );
}
