
import { prisma } from '@/lib/prisma';
import { toggleBlock } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClientEditForm from './client-edit-form';

export const dynamic = 'force-dynamic';

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
    const client = await prisma.client.findUnique({
        where: { id: params.id },
        include: {
            plan: true,
            transactions: {
                orderBy: { date: 'desc' }
            }
        },
    });

    if (!client) {
        notFound();
    }

    const plans = await prisma.plan.findMany();

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard" className="text-sm text-secondary hover:text-primary transition-colors">
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <div className="flex items-end gap-3">
                        <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
                        <span className="text-sm text-secondary mb-1.5 pb-0.5 border-b border-primary/20">ID: {client.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <a href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            {client.domain}
                        </a>
                        <span className="text-secondary/50">•</span>
                        <Link href={`/portal/${client.id}`} target="_blank" className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors">
                            View Public Portal ↗
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <form action={async () => {
                        'use server';
                        await toggleBlock(client.id, client.isBlocked);
                    }}>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${client.isBlocked
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-card-bg border border-card-border text-foreground hover:bg-background'
                                }`}
                        >
                            {client.isBlocked ? 'Unblock Client' : 'Block Access'}
                        </button>
                    </form>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${client.billingStatus === 'PAID' ? 'bg-green-500/10 text-green-500' :
                            client.billingStatus === 'OVERDUE' ? 'bg-red-500/10 text-red-500' :
                                'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {client.billingStatus}
                    </div>
                </div>
            </div>

            <ClientEditForm client={client} plans={plans} transactions={client.transactions} />
        </div>
    );
}
