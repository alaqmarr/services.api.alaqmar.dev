
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export function UpcomingRenewals({ renewals }: { renewals: any[] }) {
    return (
        <div className="overflow-hidden rounded-3xl bg-card-bg shadow-sm border border-card-border">
            <div className="p-6 border-b border-card-border">
                <h3 className="text-base font-semibold leading-6 text-foreground">Upcoming Renewals (Next 30 Days)</h3>
            </div>
            <div className="flow-root">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-background/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Client</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Due Date</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {renewals.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-secondary">
                                        No upcoming renewals in next 30 days.
                                    </td>
                                </tr>
                            ) : (
                                renewals.map((item) => (
                                    <tr key={`${item.type}-${item.id}`} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                                        <td className="px-6 py-4 text-secondary">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.type === 'Domain' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary">
                                            {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/clients/${item.id}`}
                                                className="text-primary hover:text-primary-hover font-medium flex items-center gap-1"
                                            >
                                                View <ArrowRightIcon className="w-3 h-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
