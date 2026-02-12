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
            <div className="flex w-full items-center justify-between p-4 bg-white border-b border-gray-200">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>

            <div className="p-6">
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Link
                        href="/dashboard/create"
                        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <span className="hidden md:block">Create Client</span>
                        <span className="md:hidden">+</span>
                    </Link>
                </div>
                <ClientTable clients={clients} />
            </div>
        </div>
    );
}
