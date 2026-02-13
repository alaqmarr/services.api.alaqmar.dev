'use client';

import toast from 'react-hot-toast';
import { deleteClient, toggleMaintenance, toggleBlock } from '@/lib/actions';
import Link from 'next/link';

// ... imports
import { useState, useMemo } from 'react';

export default function ClientTable({
    clients,
}: {
    // ... types
    clients: any[];
}) {
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterMaint, setFilterMaint] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesStatus = filterStatus === 'ALL' || client.billingStatus === filterStatus;
            const matchesMaint = filterMaint === 'ALL' || (filterMaint === 'TRUE' ? client.maintenanceMode : !client.maintenanceMode);
            const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.domain.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesMaint && matchesSearch;
        });
    }, [clients, filterStatus, filterMaint, searchQuery]);

    const stats = {
        total: clients.length,
        paid: clients.filter(c => c.billingStatus === 'PAID').length,
        unpaid: clients.filter(c => c.billingStatus === 'UNPAID').length,
        overdue: clients.filter(c => c.billingStatus === 'OVERDUE').length,
    };

    if (!clients || clients.length === 0) {
        // ... empty state
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-card-border bg-card-bg/50">
                <div className="mx-auto h-16 w-16 text-primary mb-4 bg-primary/10 rounded-full flex items-center justify-center text-2xl">📂</div>
                <h3 className="mt-2 text-lg font-extrabold text-foreground">No clients found</h3>
                <p className="mt-1 text-sm text-secondary max-w-sm">Get started by creating a new client to manage their services.</p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card-bg p-4 rounded-2xl border border-card-border shadow-sm">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-card-border focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                    <svg className="w-4 h-4 text-secondary absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-background border border-card-border rounded-xl px-3 py-2 text-sm text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PAID">Paid ({stats.paid})</option>
                        <option value="UNPAID">Unpaid ({stats.unpaid})</option>
                        <option value="OVERDUE">Overdue ({stats.overdue})</option>
                    </select>

                    <select
                        value={filterMaint}
                        onChange={(e) => setFilterMaint(e.target.value)}
                        className="bg-background border border-card-border rounded-xl px-3 py-2 text-sm text-secondary focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="ALL">All Modes</option>
                        <option value="TRUE">Maintenance On</option>
                        <option value="FALSE">Maintenance Off</option>
                    </select>

                    <div className="bg-background border border-card-border rounded-xl px-3 py-2 text-sm font-medium text-foreground whitespace-nowrap">
                        Total: {filteredClients.length}
                    </div>
                </div>
            </div>

            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
                {filteredClients.map((client) => {
                    const dueAmount = client.customPrice - client.amountPaid;
                    return (
                        <div key={client.id} className="relative overflow-hidden rounded-3xl border border-card-border bg-card-bg p-6 shadow-sm backdrop-blur-md">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                        {getInitials(client.name)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground text-lg">
                                            <Link href={`/dashboard/clients/${client.id}`} className="hover:underline hover:text-primary transition-colors">
                                                {client.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-secondary">{client.domain}</p>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-background text-secondary font-medium border border-card-border">
                                                {client.plan?.name || "Standard"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Status status={client.billingStatus} />
                            </div>

                            {/* Financials Card */}
                            <div className="mb-4 p-4 rounded-2xl bg-background border border-card-border grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-secondary uppercase tracking-wider">Plan Cost</p>
                                    <p className="text-sm font-bold text-foreground">₹{client.customPrice}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary uppercase tracking-wider">Due Amount</p>
                                    <p className={`text-sm font-bold ${dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        ₹{dueAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Renewal Info Card */}
                            <div className="mb-6 p-4 rounded-2xl bg-background border border-card-border">
                                {(() => {
                                    const { daysRemaining, nextRenewal } = calculateRenewal(client.startDate, client.billingCycle, client.billingStatus, client.billingPeriod);
                                    return (
                                        <>
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <p className="text-xs text-secondary uppercase tracking-wider">Renewal</p>
                                                    <p className="text-sm font-semibold text-foreground mt-0.5">
                                                        {nextRenewal.toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-foreground">{daysRemaining}</p>
                                                    <p className="text-xs text-secondary">days left</p>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-card-border rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${daysRemaining < 7 ? 'bg-[#bc8a5f]' : 'bg-[#ccd5ae]'}`}
                                                    style={{ width: `${Math.max(5, Math.min(100, (daysRemaining / 30) * 100))}%` }}
                                                ></div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-2xl bg-background border border-card-border">
                                    <span className="text-sm font-medium text-secondary">Maintenance Mode</span>
                                    <MaintenanceToggle client={client} />
                                </div>

                                <div className="flex justify-between items-center p-3 rounded-2xl bg-background border border-card-border">
                                    <span className="text-sm font-medium text-red-500">Block Access</span>
                                    <BlockToggle client={client} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-medium text-secondary uppercase tracking-wider ml-1">Access</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => copyToClipboard(client.apiKey, 'API Key Copied!')}
                                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-background text-secondary hover:bg-card-border transition-colors"
                                        >
                                            <KeyIcon className="w-3.5 h-3.5" />
                                            Copy API Key
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/api/authorize?clientId=${client.id}`, 'Link Copied!')}
                                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
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
                    )
                })}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-card-border bg-card-bg shadow-sm">
                <table className="min-w-full text-foreground">
                    <thead className="bg-background border-b border-card-border text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-8 py-5">Client</th>
                            <th scope="col" className="px-6 py-5">Plan & Due</th>
                            <th scope="col" className="px-6 py-5">Status</th>
                            <th scope="col" className="px-6 py-5">Controls</th>
                            <th scope="col" className="px-6 py-5">Credentials</th>
                            <th scope="col" className="relative px-6 py-5">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                        {filteredClients.map((client) => {
                            const dueAmount = client.customPrice - client.amountPaid;
                            return (
                                <tr key={client.id} className="group hover:bg-primary/5 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                {getInitials(client.name)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">
                                                    <Link href={`/dashboard/clients/${client.id}`} className="hover:underline hover:text-primary transition-colors">
                                                        {client.name}
                                                    </Link>
                                                </div>
                                                <div className="text-xs text-secondary">{client.domain}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {(() => {
                                            const { daysRemaining } = calculateRenewal(client.startDate, client.billingCycle, client.billingStatus, client.billingPeriod);
                                            return (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-foreground">{client.plan?.name || "Standard"}</span>
                                                    <span className={`text-xs font-bold ${dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                        Due: ₹{dueAmount.toFixed(2)}
                                                    </span>
                                                    <span className="text-[10px] text-secondary">
                                                        {daysRemaining} days left
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <Status status={client.billingStatus} />
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-secondary">Maint.</span>
                                                <MaintenanceToggle client={client} />
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-red-400">Block</span>
                                                <BlockToggle client={client} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => copyToClipboard(client.apiKey, 'API Key Copied!')}
                                                className="p-2 rounded-lg bg-background text-secondary hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 shadow-sm"
                                                title="Copy API Key"
                                            >
                                                <KeyIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(`${window.location.origin}/api/authorize?clientId=${client.id}`, 'Auth URL Copied!')}
                                                className="p-2 rounded-lg bg-background text-secondary hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 shadow-sm"
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
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Status({ status }: { status: string }) {
    const styles = {
        PAID: 'bg-[#ccd5ae]/20 text-[#2d2a26] ring-[#ccd5ae] dark:bg-[#ccd5ae]/10 dark:text-[#ccd5ae] dark:ring-[#ccd5ae]/50',
        UNPAID: 'bg-[#f5f5f4] text-[#57534e] ring-[#d6d3d1] dark:bg-white/5 dark:text-[#a8a29e] dark:ring-white/10',
        OVERDUE: 'bg-[#bc8a5f]/10 text-[#bc8a5f] ring-[#bc8a5f] dark:bg-[#bc8a5f]/20 dark:text-[#bc8a5f] dark:ring-[#bc8a5f]/50'
    };
    const dotStyles = {
        PAID: 'fill-[#ccd5ae]',
        UNPAID: 'fill-[#a8a29e]',
        OVERDUE: 'fill-[#bc8a5f]'
    };

    const key = status as keyof typeof styles;

    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[key]}`}>
            <svg className={`h-1.5 w-1.5 ${dotStyles[key]}`} viewBox="0 0 6 6" aria-hidden="true">
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
                className={`group relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#d4a373] focus:ring-offset-2 ${isMaintenance ? 'bg-[#d4a373]' : 'bg-[#e5e5e5] dark:bg-stone-700'}`}
                role="switch"
                aria-checked={isMaintenance}
                title={isMaintenance ? 'Turn Maintenance Off' : 'Turn Maintenance On'}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isMaintenance ? 'translate-x-4' : 'translate-x-0'}`}
                />
            </button>
        </form>
    )
}

function BlockToggle({ client }: { client: any }) {
    const isBlocked = client.isBlocked;
    return (
        <form action={toggleBlock.bind(null, client.id, isBlocked)}>
            <button
                className={`group relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isBlocked ? 'bg-red-500' : 'bg-[#e5e5e5] dark:bg-stone-700'}`}
                role="switch"
                aria-checked={isBlocked}
                title={isBlocked ? 'Unblock Client' : 'Block Client'}
            >
                <span className="sr-only">Block Access</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isBlocked ? 'translate-x-4' : 'translate-x-0'}`}
                />
            </button>
        </form>
    )
}

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={deleteClient.bind(null, id)}>
            <button className="text-[#a8a29e] hover:text-[#bc8a5f] transition-colors p-2 rounded-full hover:bg-[#bc8a5f]/10" title="Delete Client">
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

    // Grace Period Logic
    let isGracePeriod = false;
    if (status === 'OVERDUE') {
        // Simplified grace logic
        isGracePeriod = true;
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
