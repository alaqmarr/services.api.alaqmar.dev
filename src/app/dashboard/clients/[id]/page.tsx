
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClientEditForm from './client-edit-form';

export const dynamic = 'force-dynamic';

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch client with plan and transactions
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            transactions: {
                orderBy: { createdAt: 'desc' }
            },
            plan: true
        },
    });

    if (!client) {
        notFound();
    }

    // Fetch all plans for the dropdown
    const plans = await prisma.plan.findMany();

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link href="/dashboard" className="text-sm text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Dashboard
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {client.domain ? (
                                <a href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    {client.domain}
                                </a>
                            ) : (
                                <span className="text-sm text-secondary">No Domain</span>
                            )}
                            <span className="text-xs text-secondary/40 font-mono">ID: {client.id.slice(0, 8)}...</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.billingStatus === 'PAID' ? 'text-green-500 bg-green-500/10' :
                                client.billingStatus === 'OVERDUE' ? 'text-red-500 bg-red-500/10' :
                                    'text-yellow-500 bg-yellow-500/10'
                            }`}>
                            {client.billingStatus}
                        </span>
                    </div>
                </div>
            </div>

            <ClientEditForm client={client} transactions={client.transactions} plans={plans} />
        </div>
    );
}
