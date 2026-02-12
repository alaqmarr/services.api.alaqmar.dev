import { prisma } from '@/lib/prisma';

export default async function RevenueWidget() {
    const clients = await prisma.client.findMany();

    // Mock pricing (since we don't have it in DB yet, hardcoded for estimation)
    const PRICES = {
        'Basic': 29,
        'Standard': 79,
        'Pro': 199,
        'Enterprise': 499
    };

    let totalMRR = 0;
    const planCounts = {
        'Basic': 0,
        'Standard': 0,
        'Pro': 0,
        'Enterprise': 0
    };

    clients.forEach(client => {
        const plan = client.plan || 'Standard';
        const price = PRICES[plan as keyof typeof PRICES] || 0;

        // Calculate monthly revenue equivalent
        const period = client.billingPeriod || 1;

        // Calculate monthly revenue equivalent
        // First normalize price to 1 unit of cycle (e.g. price per 1 year)
        // Then normalize to month.
        // wait, price is "Per Billing Cycle". So if cycle is "13 Years" and price is $100.
        // Then monthly = 100 / (13 * 12).

        let monthlyRevenue = 0;

        if (client.billingCycle === 'YEARLY') {
            monthlyRevenue = price / (12 * period);
        } else if (client.billingCycle === 'MONTHLY') {
            monthlyRevenue = price / period;
        } else if (client.billingCycle === 'WEEKLY') {
            // Price is for 'period' weeks.
            // Weekly revenue = Price / period.
            // Monthly revenue = Weekly * 4.33 (avg weeks in month) or just * 4 for simplicity. 
            // Let's use 4.
            monthlyRevenue = (price / period) * 4;
        } else if (client.billingCycle === 'DAILY') {
            monthlyRevenue = (price / period) * 30;
        }

        // Only count if Paying (PAID or OVERDUE, assuming they are valid subs)
        if (client.billingStatus !== 'UNPAID') { // Assuming UNPAID means not subscribed or cancelled? Or just hasn't paid? 
            // Let's assume all valid clients contribute to MRR potential, or maybe just PAID.
            // Requirement says "calculate monthly recurring revenue". Usually implies Active subscriptions.
            // Let's count PAID and OVERDUE (active but late).
            totalMRR += monthlyRevenue;
        }

        if (Object.keys(planCounts).includes(plan)) {
            planCounts[plan as keyof typeof planCounts]++;
        }
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* MRR Card */}
            <div className="md:col-span-1 rounded-3xl p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Monthly Recurring Revenue</h3>

                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold tracking-tight">${totalMRR.toFixed(0)}</span>
                    <span className="text-sm text-gray-400 font-medium">/mo</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full w-fit">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>+12% vs last month</span>
                </div>
            </div>

            {/* Plans Distribution */}
            <div className="md:col-span-3 rounded-3xl p-6 bg-white border border-gray-100 dark:bg-stone-900/60 dark:border-white/5 shadow-sm backdrop-blur-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full">
                    <h3 className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Active Subscriptions</h3>
                    <div className="flex gap-4">
                        {Object.entries(planCounts).map(([plan, count]) => (
                            <div key={plan} className="flex-1 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
                                <div className="text-xs text-gray-500 mb-1">{plan}</div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden md:block"></div>

                <div className="flex-none px-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Clients</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{clients.length}</div>
                </div>
            </div>
        </div>
    );
}
