'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { deleteClient } from '@/lib/actions';

export default function ClientTable({ clients }: { clients: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = useMemo(() => {
        if (!searchQuery) return clients;
        const q = searchQuery.toLowerCase();
        return clients.filter(c =>
            c.name.toLowerCase().includes(q) ||
            (c.email && c.email.toLowerCase().includes(q)) ||
            (c.company && c.company.toLowerCase().includes(q)) ||
            (c.domain && c.domain.toLowerCase().includes(q))
        );
    }, [clients, searchQuery]);

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <svg className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                    type="text"
                    placeholder="Search by name, email, domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-3 md:hidden">
                {filtered.map((client) => {
                    const statusColor =
                        client.billingStatus === 'PAID' ? 'text-green-500 bg-green-500/10' :
                            client.billingStatus === 'OVERDUE' ? 'text-red-500 bg-red-500/10' :
                                'text-yellow-500 bg-yellow-500/10';

                    return (
                        <Link
                            key={client.id}
                            href={`/dashboard/clients/${client.id}`}
                            className="block rounded-2xl bg-card-bg border border-card-border p-4 transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99]"
                        >
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                                    {client.domain && (
                                        <p className="text-xs text-primary mt-0.5">{client.domain}</p>
                                    )}
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor}`}>
                                    {client.billingStatus}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-secondary">
                                {client.email && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {client.email}
                                    </span>
                                )}
                                {client.plan && (
                                    <span className="flex items-center gap-1 text-foreground">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        {client.plan.name}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block rounded-2xl bg-card-bg border border-card-border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-card-border">
                            <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-5 py-3">Client</th>
                            <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-5 py-3">Domain</th>
                            <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-5 py-3">Status</th>
                            <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-5 py-3">Plan</th>
                            <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-5 py-3">Added</th>
                            <th className="px-5 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-sm text-secondary">
                                    {searchQuery ? 'No clients match your search.' : 'No clients yet.'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((client) => {
                                const statusColor =
                                    client.billingStatus === 'PAID' ? 'text-green-500 bg-green-500/10' :
                                        client.billingStatus === 'OVERDUE' ? 'text-red-500 bg-red-500/10' :
                                            'text-yellow-500 bg-yellow-500/10';

                                return (
                                    <tr key={client.id} className="hover:bg-primary/[0.03] transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <Link href={`/dashboard/clients/${client.id}`} className="group/link">
                                                <p className="text-sm font-semibold text-foreground group-hover/link:text-primary transition-colors">{client.name}</p>
                                                {client.email && <p className="text-xs text-secondary mt-0.5">{client.email}</p>}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {client.domain ? (
                                                <a href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                    {client.domain}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-secondary/50">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                                {client.billingStatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="text-sm text-foreground">{client.plan?.name || 'Custom'}</div>
                                            <div className="text-xs text-secondary">{client.billingCycle}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-xs text-secondary">{formatDistanceToNow(new Date(client.createdAt), { addSuffix: true })}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <Link
                                                href={`/dashboard/clients/${client.id}`}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
