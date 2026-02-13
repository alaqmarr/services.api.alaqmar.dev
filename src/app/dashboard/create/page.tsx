
import CreateForm from '@/app/ui/dashboard/create-form';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New Client',
};

export default async function Page() {
    const plans = await prisma.plan.findMany();

    return (
        <main className="w-full">
            <CreateForm plans={plans} />
        </main>
    );
}
