'use client';

import toast from 'react-hot-toast';
import { deleteClient, toggleMaintenance } from '@/lib/actions';

export default function ClientTable({
    clients,
}: {
    clients: Array<{
        id: string;
        name: string;
        domain: string;
        billingStatus: 'PAID' | 'UNPAID' | 'OVERDUE';
        maintenanceMode: boolean;
        apiKey: string;
        plan: string;
        billingCycle: string;
        billingPeriod: number;
        startDate: Date;
    }>;
}) {
    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    if (!clients || clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-white/5">
                <div className="mx-auto h-16 w-16 text-orange-300 mb-4 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-2xl">📂</div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No clients found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">Get started by creating a new client to manage their services.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
                {clients?.map((client) => (
                    <div key={client.id} className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/5 bg-white/60 dark:bg-stone-800/40 p-6 shadow-sm backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-stone-700 dark:to-stone-600 flex items-center justify-center text-orange-900 dark:text-orange-100 font-bold text-lg shadow-inner">
                                    {getInitials(client.name)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{client.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{client.domain}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-medium">
                                            {client.plan}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Status status={client.billingStatus} />
                        </div>

                        {/* Renewal Info Card */}
                        <div className="mb-6 p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5">
                            {(() => {
                                const { daysRemaining, nextRenewal } = calculateRenewal(client.startDate, client.billingCycle, client.billingStatus, client.billingPeriod);
                                return (
                                    <>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Renewal</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 mt-0.5">
                                                    {nextRenewal.toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{daysRemaining}</p>
                                                <p className="text-xs text-gray-500">days left</p>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${daysRemaining < 7 ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.max(5, Math.min(100, (daysRemaining / 30) * 100))}%` }}
                                            ></div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Maintenance Mode</span>
                                <MaintenanceToggle client={client} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Access</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => copyToClipboard(client.apiKey, 'API Key Copied!')}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <KeyIcon className="w-3.5 h-3.5" />
                                        Copy API Key
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(`${window.location.origin}/api/authorize?clientId=${client.id}`, 'Link Copied!')}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                                    >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4">
                            <DeleteButton id={client.id} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-white/40 dark:border-white/5 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md shadow-sm">
                <table className="min-w-full text-gray-900 dark:text-gray-100">
                    <thead className="bg-white/50 dark:bg-white/5 border-b border-white/20 dark:border-white/5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-8 py-5">Client</th>
                            <th scope="col" className="px-6 py-5">Plan</th>
                            <th scope="col" className="px-6 py-5">Status</th>
                            <th scope="col" className="px-6 py-5">Maintenance</th>
                            <th scope="col" className="px-6 py-5">Credentials</th>
                            <th scope="col" className="relative px-6 py-5">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20 dark:divide-white/5">
                        {clients?.map((client) => (
                            <tr key={client.id} className="group hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                                <td className="px-8 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-stone-700 dark:to-stone-600 flex items-center justify-center text-orange-900 dark:text-orange-100 font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                            {getInitials(client.name)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{client.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{client.domain}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    {(() => {
                                        const { daysRemaining } = calculateRenewal(client.startDate, client.billingCycle, client.billingStatus, client.billingPeriod);
                                        return (
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{client.plan}</span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    {daysRemaining} days left
                                                    <div className={`h-1.5 w-1.5 rounded-full ${daysRemaining < 7 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <Status status={client.billingStatus} />
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <MaintenanceToggle client={client} />
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => copyToClipboard(client.apiKey, 'API Key Copied!')}
                                            className="p-2 rounded-lg bg-white dark:bg-black/20 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 shadow-sm"
                                            title="Copy API Key"
                                        >
                                            <KeyIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/api/authorize?clientId=${client.id}`, 'Auth URL Copied!')}
                                            className="p-2 rounded-lg bg-white dark:bg-black/20 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 shadow-sm"
                                            title="Copy Link"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-right">
                                    <DeleteButton id={client.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Status({ status }: { status: string }) {
    const styles = {
        PAID: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
        UNPAID: 'bg-stone-50 text-stone-600 ring-stone-500/10 dark:bg-stone-500/10 dark:text-stone-400 dark:ring-stone-500/20',
        OVERDUE: 'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20'
    };
    const dotStyles = {
        PAID: 'bg-emerald-500',
        UNPAID: 'bg-stone-500',
        OVERDUE: 'bg-rose-500'
    };

    const key = status as keyof typeof styles;

    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[key]}`}>
            <svg className={`h-1.5 w-1.5 fill-current ${dotStyles[key]}`} viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
            </svg>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

function MaintenanceToggle({ client }: { client: any }) {
    const isMaintenance = client.maintenanceMode;
    return (
        <form action={toggleMaintenance.bind(null, client.id, isMaintenance)}>
            <button
                className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isMaintenance ? 'bg-orange-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                role="switch"
                aria-checked={isMaintenance}
                title={isMaintenance ? 'Turn Maintenance Off' : 'Turn Maintenance On'}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isMaintenance ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </form>
    )
}

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={deleteClient.bind(null, id)}>
            <button className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete Client">
                <span className="sr-only">Delete</span>
                <TrashIcon className="w-5 h-5" />
            </button>
        </form>
    )
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}


function calculateRenewal(startDate: Date, cycle: string, status: string, period: number = 1) {
    const start = new Date(startDate);
    const today = new Date();
    let nextRenewal = new Date(start);

    // If start date is infinite loop protection (unlikely but safe)
    let ops = 0;
    while (nextRenewal < today && ops < 1000) {
        if (cycle === 'YEARLY') {
            nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        } else if (cycle === 'MONTHLY') {
            nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        } else if (cycle === 'WEEKLY') {
            nextRenewal.setDate(nextRenewal.getDate() + 7);
        } else if (cycle === 'DAILY') {
            nextRenewal.setDate(nextRenewal.getDate() + 1);
        }
        ops++;
    }

    const diffTime = nextRenewal.getTime() - today.getTime();

    // Grace Period Logic
    let isGracePeriod = false;
    if (status === 'OVERDUE') {
        const lastRenewal = new Date(nextRenewal);
        if (cycle === 'YEARLY') {
            lastRenewal.setFullYear(lastRenewal.getFullYear() - 1);
        } else if (cycle === 'MONTHLY') {
            lastRenewal.setMonth(lastRenewal.getMonth() - 1);
        } else if (cycle === 'WEEKLY') {
            lastRenewal.setDate(lastRenewal.getDate() - 7);
        } else if (cycle === 'DAILY') {
            lastRenewal.setDate(lastRenewal.getDate() - 1);
        }

        const daysSinceRenewal = Math.floor((today.getTime() - lastRenewal.getTime()) / (1000 * 60 * 60 * 24));
        // Grace period differs by cycle: 
        // Daily: 1 day? Weekly: 2 days? Monthly/Yearly: 3 days?
        // Let's keep it simple for now, maybe shorter for daily.
        const graceLimit = cycle === 'DAILY' ? 0 : (cycle === 'WEEKLY' ? 2 : 3);

        if (daysSinceRenewal >= 0 && daysSinceRenewal <= graceLimit) {
            isGracePeriod = true;
        }
    }

    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return { daysRemaining, nextRenewal, isGracePeriod };
}

// Icons
function KeyIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
    )
}

function LinkIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
    )
}

function TrashIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    )
}
