
export function DashboardStats({
    stats,
}: {
    stats: {
        totalClients: number;
        paidClients: number;
        unpaidClients: number;
        overdueClients: number;
        totalRevenue: number;
        pendingAmount: number;
        totalTransactions: number;
    };
}) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="col-span-2 md:col-span-1 rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                            Revenue
                        </p>
                        <h3 className="text-2xl font-bold text-foreground mt-0.5">
                            ₹{stats.totalRevenue.toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Paid Clients */}
            <div className="rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    Paid Users
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-foreground">
                        {stats.paidClients}
                    </h3>
                    <span className="text-xs text-secondary">
                        / {stats.totalClients} total
                    </span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                            width: stats.totalClients > 0 ? `${(stats.paidClients / stats.totalClients) * 100}%` : '0%',
                        }}
                    />
                </div>
            </div>

            {/* Unpaid Clients */}
            <div className="rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    Unpaid / Pending
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-foreground">
                        {stats.unpaidClients}
                    </h3>
                    <span className="text-xs text-secondary">clients</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                            width: stats.totalClients > 0 ? `${(stats.unpaidClients / stats.totalClients) * 100}%` : '0%',
                        }}
                    />
                </div>
            </div>

            {/* Overdue Clients */}
            <div className="rounded-2xl bg-card-bg border border-card-border p-6 shadow-sm">
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    Overdue
                </p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-foreground">
                        {stats.overdueClients}
                    </h3>
                    <span className="text-xs text-secondary">clients</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-secondary/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                            width: stats.totalClients > 0 ? `${(stats.overdueClients / stats.totalClients) * 100}%` : '0%',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
