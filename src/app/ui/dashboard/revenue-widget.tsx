
import { prisma } from '@/lib/prisma';

export default async function RevenueWidget() {
    const stats = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: 'PAYMENT' }
    });

    const totalRevenue = stats._sum.amount ? Number(stats._sum.amount) : 0;

    // Get revenue for last 30 days for a trend (simple approx)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentStats = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
            type: 'PAYMENT',
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    const recentRevenue = recentStats._sum.amount ? Number(recentStats._sum.amount) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl bg-card-bg border border-card-border p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-card-bg border border-card-border p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">Last 30 Days</p>
                <p className="text-4xl font-bold text-emerald-500 tracking-tight">+₹{recentRevenue.toLocaleString()}</p>
            </div>
        </div>
    );
}
