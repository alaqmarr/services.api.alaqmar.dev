'use client';

import { updateClient, addTransaction, State } from '@/lib/actions';
import { Plan } from '@/lib/generated/prisma/client';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function ClientEditForm({
    client,
    transactions,
    plans
}: {
    client: any,
    transactions?: any[],
    plans: Plan[]
}) {
    const updateClientWithId = updateClient.bind(null, client.id);
    const initialState: State = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(updateClientWithId, initialState);
    const [showTxForm, setShowTxForm] = useState(false);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Updated!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="space-y-8">
            <form action={dispatch} className="space-y-8">
                {/* Basic Info */}
                <div className="rounded-2xl bg-card-bg border border-card-border p-6">
                    <h2 className="text-sm font-semibold text-foreground mb-5">Client Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Name</label>
                            <input
                                id="name" name="name" type="text" defaultValue={client.name} required
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                id="email" name="email" type="email" defaultValue={client.email || ''}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="domain" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Domain</label>
                            <input
                                id="domain" name="domain" type="text" defaultValue={client.domain || ''}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Plan & Billing */}
                <div className="rounded-2xl bg-card-bg border border-card-border p-6">
                    <h2 className="text-sm font-semibold text-foreground mb-5">Subscription & Billing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="planId" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Plan</label>
                            <select
                                id="planId" name="planId" defaultValue={client.planId || ''}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            >
                                <option value="">Select a plan...</option>
                                {plans.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="billingStatus" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Status</label>
                            <select
                                id="billingStatus" name="billingStatus" defaultValue={client.billingStatus || 'UNPAID'}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            >
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                                <option value="OVERDUE">Overdue</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="customPrice" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Custom Price</label>
                            <input
                                id="customPrice" name="customPrice" type="number" defaultValue={client.customPrice ? parseFloat(client.customPrice) : 0} step="0.01"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="renewalPrice" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Renewal Price</label>
                            <input
                                id="renewalPrice" name="renewalPrice" type="number" defaultValue={client.renewalPrice ? parseFloat(client.renewalPrice) : 0} step="0.01"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="billingCycle" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Billing Cycle</label>
                            <select
                                id="billingCycle" name="billingCycle" defaultValue={client.billingCycle || 'MONTHLY'}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                                <option value="DAILY">Daily</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Domain Details */}
                <div className="rounded-2xl bg-card-bg border border-card-border p-6">
                    <h2 className="text-sm font-semibold text-foreground mb-5">Domain Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="domainProvider" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Provider</label>
                            <input
                                id="domainProvider" name="domainProvider" type="text" defaultValue={client.domainProvider || ''}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="domainExpiry" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1.5">Expiry Date</label>
                            <input
                                id="domainExpiry" name="domainExpiry" type="date"
                                defaultValue={client.domainExpiry ? new Date(client.domainExpiry).toISOString().split('T')[0] : ''}
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]">
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Transactions */}
            <div className="rounded-2xl bg-card-bg border border-card-border overflow-hidden">
                <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">Transactions</h2>
                    <button
                        onClick={() => setShowTxForm(!showTxForm)}
                        className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                    >
                        {showTxForm ? 'Cancel' : '+ Add'}
                    </button>
                </div>

                {showTxForm && (
                    <TransactionForm clientId={client.id} onClose={() => setShowTxForm(false)} />
                )}

                <div className="divide-y divide-card-border">
                    {(!transactions || transactions.length === 0) ? (
                        <div className="px-6 py-8 text-center text-sm text-secondary">No transactions yet.</div>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx.id} className="px-6 py-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.type === 'PAYMENT' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">₹{Number(tx.amount).toLocaleString()}</p>
                                        <p className="text-xs text-secondary">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${tx.type === 'PAYMENT' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                    {tx.type}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function TransactionForm({ clientId, onClose }: { clientId: string, onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const form = e.target as HTMLFormElement;
        const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
        const type = (form.elements.namedItem('type') as HTMLSelectElement).value;

        const result = await addTransaction(clientId, amount, type);

        if (result.success) {
            toast.success(result.message || 'Transaction added');
            onClose();
        } else {
            toast.error(result.message || 'Failed');
        }
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="px-6 py-4 border-b border-card-border bg-background/50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-secondary mb-1">Amount (₹)</label>
                    <input
                        name="amount" type="number" step="0.01" required placeholder="0.00"
                        className="w-full rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-secondary mb-1">Type</label>
                    <select
                        name="type" defaultValue="PAYMENT"
                        className="w-full rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="PAYMENT">Payment</option>
                        <option value="ADJUSTMENT">Adjustment</option>
                    </select>
                </div>
            </div>
            <button
                type="submit" disabled={loading}
                className="rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-all hover:opacity-90 disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Transaction'}
            </button>
        </form>
    );
}
