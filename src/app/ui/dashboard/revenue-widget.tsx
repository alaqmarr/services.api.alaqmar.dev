import { prisma } from '@/lib/prisma';

export default async function RevenueWidget() {
    const clients = await prisma.client.findMany({
        include: { plan: true }
    });

    let totalMRR = 0;
    const planCounts: Record<string, number> = {};

    clients.forEach(client => {
        const planName = client.plan?.name || 'Custom';

        // Count Plans
        if (planCounts[planName]) {
            planCounts[planName]++;
        } else {
            planCounts[planName] = 1;
        }

        // Calculate MRR based on Custom Price (which is the actual billing amount)
        const price = Number(client.customPrice) || 0;
        const period = client.billingPeriod || 1;

        let monthlyRevenue = 0;

        if (client.billingCycle === 'YEARLY') {
            monthlyRevenue = price / (12 * period);
        } else if (client.billingCycle === 'MONTHLY') {
            monthlyRevenue = price / period;
        } else if (client.billingCycle === 'WEEKLY') {
            monthlyRevenue = (price / period) * 4.33; // Avg weeks/month
        } else if (client.billingCycle === 'DAILY') {
            monthlyRevenue = (price / period) * 30;
        }

        // Only count if Paying (PAID or OVERDUE, assuming they are valid subs)
        if (client.billingStatus !== 'UNPAID') {
            totalMRR += monthlyRevenue;
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* MRR Card */}
            <div className="md:col-span-1 rounded-3xl p-6 bg-[#1c1917] text-[#fdfcf8] shadow-xl shadow-[#1c1917]/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#d4a373]/10 rounded-full blur-3xl group-hover:bg-[#d4a373]/20 transition-colors"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-[#e6ccb2]/10 rounded-full blur-3xl"></div>

                <h3 className="text-[#a8a29e] text-xs font-medium uppercase tracking-wider mb-1">Monthly Recurring Revenue</h3>

                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold tracking-tight font-sans">₹{totalMRR.toFixed(0)}</span>
                    <span className="text-sm text-[#78716c] font-medium">/mo</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#2d2a26] bg-[#ccd5ae] px-2.5 py-1 rounded-full w-fit font-medium">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Dynamic</span>
                </div>
            </div>

            {/* Plans Distribution */}
            <div className="md:col-span-3 rounded-3xl p-6 bg-card-bg border border-card-border shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full">
                    <h3 className="text-secondary text-xs font-medium uppercase tracking-wider mb-4">Active Subscriptions</h3>
                    <div className="flex gap-4 flex-wrap">
                        {Object.entries(planCounts).length > 0 ? (
                            Object.entries(planCounts).map(([plan, count]) => (
                                <div key={plan} className="flex-1 min-w-[100px] p-3 rounded-2xl bg-background border border-transparent hover:border-primary text-center transition-all">
                                    <div className="text-xs text-secondary mb-1">{plan}</div>
                                    <div className="text-xl font-bold text-foreground">{count}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-secondary italic w-full text-center">No active plans</div>
                        )}
                    </div>
                </div>

                <div className="w-px h-12 bg-card-border hidden md:block"></div>

                <div className="flex-none px-4 text-center">
                    <div className="text-xs text-secondary mb-1">Total Clients</div>
                    <div className="text-3xl font-bold text-foreground">{clients.length}</div>
                </div>
            </div>
        </div>
    );
}
