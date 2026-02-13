
import {
    BanknotesIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export function DashboardStats({ stats }: { stats: any }) {
    const cards = [
        {
            name: 'Total Clients',
            value: stats.totalClients,
            icon: UserGroupIcon,
            change: '+2 this month', // Placeholder
            changeType: 'positive',
        },
        {
            name: 'Monthly Recurring Revenue',
            value: `₹${stats.mrr.toLocaleString()}`,
            icon: BanknotesIcon,
            change: 'Approximate',
            changeType: 'neutral',
        },
        {
            name: 'Outstanding Dues',
            value: `₹${stats.outstanding.toLocaleString()}`,
            icon: ExclamationCircleIcon,
            change: 'Needs Attention',
            changeType: stats.outstanding > 0 ? 'negative' : 'positive',
        },
        {
            name: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: ArrowTrendingUpIcon,
            change: 'All time',
            changeType: 'neutral',
        },
    ];

    return (
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((item) => (
                <div
                    key={item.name}
                    className="relative overflow-hidden rounded-3xl bg-card-bg px-4 pt-5 pb-12 shadow-sm border border-card-border sm:px-6 sm:pt-6"
                >
                    <dt>
                        <div className="absolute rounded-xl bg-primary/10 p-3">
                            <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-secondary">{item.name}</p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
                        <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                        <p
                            className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'positive' ? 'text-green-600' :
                                    item.changeType === 'negative' ? 'text-red-600' : 'text-secondary'
                                }`}
                        >
                            {item.change}
                        </p>
                    </dd>
                </div>
            ))}
        </dl>
    );
}
