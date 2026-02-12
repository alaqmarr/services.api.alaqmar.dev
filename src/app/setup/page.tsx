import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SetupForm from '@/app/ui/setup-form';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
        redirect('/login');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-gray-50 px-6 py-8 shadow-md">
                <h1 className="mb-3 text-2xl font-bold text-gray-900">
                    Initial Setup
                </h1>
                <p className="mb-6 text-sm text-gray-500">
                    Create your first admin account to get started.
                </p>
                <SetupForm />
            </div>
        </main>
    );
}
