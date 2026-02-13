import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientPortalPage({ params }: { params: { id: string } }) {
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

    const customPrice = Number(client.customPrice);
    const amountPaid = Number(client.amountPaid);
    const dueAmount = customPrice - amountPaid;

    // Calculate Renewal
    const { daysRemaining, nextRenewal } = calculateRenewal(client.startDate, client.billingCycle, client.billingPeriod);

    return (
        <div className="min-h-screen bg-[#f5f5f4] dark:bg-[#1c1917] font-sans selection:bg-[#d4a373] selection:text-white">
            <div className="max-w-5xl mx-auto p-6 md:p-12">
                {/* Brand Header */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-bold tracking-tight text-[#2d2a26] dark:text-[#e7e5e4] uppercase">
                        Service Portal
                    </h1>
                    <p className="text-[#a8a29e] text-sm mt-1">Client Dashboard</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Status & Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-white dark:bg-[#292524] rounded-3xl p-8 shadow-sm border border-[#e5e5e5] dark:border-[#44403c]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <span className="text-xs uppercase tracking-wider text-[#a8a29e] font-semibold">Welcome Back</span>
                                    <h2 className="text-3xl font-bold text-[#2d2a26] dark:text-[#e7e5e4] mt-1">{client.name}</h2>
                                    <a href={`https://${client.domain}`} target="_blank" className="inline-block mt-2 text-[#d4a373] hover:underline font-medium">
                                        {client.domain} ↗
                                    </a>
                                </div>
                                <div className={`px-4 py-2 rounded-full border ${client.isBlocked
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : dueAmount > 0
                                            ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                                            : 'bg-green-50 border-green-200 text-green-600'
                                    }`}>
                                    <span className="font-bold text-sm uppercase tracking-wide">
                                        {client.isBlocked ? 'Service Suspended' : dueAmount > 0 ? 'Payment Due' : 'Active'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#f5f5f4] dark:border-[#44403c]">
                                <div>
                                    <p className="text-xs text-[#a8a29e] uppercase tracking-wider">Current Plan</p>
                                    <p className="text-lg font-semibold text-[#57534e] dark:text-[#d6d3d1] mt-1">{client.plan?.name || "Standard Plan"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#a8a29e] uppercase tracking-wider">Next Payment</p>
                                    <p className="text-lg font-semibold text-[#57534e] dark:text-[#d6d3d1] mt-1">{nextRenewal.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#a8a29e] uppercase tracking-wider">Days Remaining</p>
                                    <p className="text-lg font-semibold text-[#57534e] dark:text-[#d6d3d1] mt-1">{daysRemaining} Days</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="bg-white dark:bg-[#292524] rounded-3xl p-8 shadow-sm border border-[#e5e5e5] dark:border-[#44403c]">
                            <h3 className="text-lg font-bold text-[#2d2a26] dark:text-[#e7e5e4] mb-6">Transaction History</h3>
                            <div className="space-y-0 divide-y divide-[#f5f5f4] dark:divide-[#44403c]">
                                {client.transactions.length > 0 ? (
                                    client.transactions.map((tx) => (
                                        <div key={tx.id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                                            <div>
                                                <p className="text-[#57534e] dark:text-[#d6d3d1] font-medium">{tx.description || "Payment"}</p>
                                                <p className="text-xs text-[#a8a29e] mt-0.5">{new Date(tx.date).toLocaleDateString()} • {tx.method || "Online"}</p>
                                            </div>
                                            <span className="font-bold text-[#57534e] dark:text-[#d6d3d1]">
                                                ₹{Number(tx.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[#a8a29e] text-sm py-4 italic">No transactions found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Financials & Domain */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-[#2d2a26] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" /></svg>
                            </div>

                            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Total Due Amount</p>
                            <h3 className="text-4xl font-bold mb-6">₹{dueAmount.toFixed(2)}</h3>

                            <div className="space-y-3 border-t border-white/10 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Plan Cost (Cycle)</span>
                                    <span className="font-medium">₹{customPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Total Paid</span>
                                    <span className="font-medium text-green-400">- ₹{amountPaid.toFixed(2)}</span>
                                </div>
                            </div>

                            {dueAmount > 0 ? (
                                <button className="w-full mt-6 bg-[#d4a373] hover:bg-[#c39263] text-white py-3 rounded-xl font-bold transition-colors">
                                    Pay Now
                                </button>
                            ) : (
                                <div className="mt-6 bg-white/10 text-center py-3 rounded-xl text-sm font-medium text-white/80">
                                    All caught up! 🎉
                                </div>
                            )}
                        </div>

                        {/* Domain Info */}
                        <div className="bg-white dark:bg-[#292524] rounded-3xl p-6 shadow-sm border border-[#e5e5e5] dark:border-[#44403c]">
                            <h3 className="text-sm font-bold text-[#2d2a26] dark:text-[#e7e5e4] mb-4 uppercase tracking-wider">Domain Details</h3>

                            {client.domainExpiry ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#f5f5f4] dark:bg-[#44403c] flex items-center justify-center text-lg">
                                            🌍
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#57534e] dark:text-[#d6d3d1]">{client.domainProvider || "Provider Unknown"}</p>
                                            <p className="text-xs text-[#a8a29e]">Registrar</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-[#a8a29e]">Expires on</span>
                                            <span className="text-[#57534e] dark:text-[#d6d3d1] font-medium">{new Date(client.domainExpiry).toLocaleDateString()}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#f5f5f4] dark:bg-[#44403c] rounded-full overflow-hidden">
                                            {(() => {
                                                const total = new Date(client.domainExpiry).getTime() - (client.domainBoughtAt ? new Date(client.domainBoughtAt).getTime() : new Date().getTime() - 1000 * 60 * 60 * 24 * 365);
                                                const current = new Date(client.domainExpiry).getTime() - new Date().getTime();
                                                const progress = 100 - (current / total * 100);
                                                return <div className="h-full bg-[#d4a373]" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}></div>
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-[#a8a29e] italic">No domain information available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center border-t border-[#e5e5e5] dark:border-[#44403c] pt-8">
                    <p className="text-xs text-[#a8a29e]">
                        &copy; {new Date().getFullYear()} Alaqmar Services. All System Rights Reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

function calculateRenewal(startDate: Date, cycle: string, period: number = 1) {
    const start = new Date(startDate);
    const today = new Date();
    let nextRenewal = new Date(start);

    // If start date is infinite loop protection (unlikely but safe)
    let ops = 0;
    while (nextRenewal < today && ops < 1000) {
        if (cycle === 'YEARLY') {
            nextRenewal.setFullYear(nextRenewal.getFullYear() + 1 * period);
        } else if (cycle === 'MONTHLY') {
            nextRenewal.setMonth(nextRenewal.getMonth() + 1 * period);
        } else if (cycle === 'WEEKLY') {
            nextRenewal.setDate(nextRenewal.getDate() + 7 * period);
        } else if (cycle === 'DAILY') {
            nextRenewal.setDate(nextRenewal.getDate() + 1 * period);
        }
        ops++;
    }

    const diffTime = nextRenewal.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return { daysRemaining, nextRenewal };
}
