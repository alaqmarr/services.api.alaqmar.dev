'use client';

import { updateClient, addTransaction, renewClient, State } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function ClientEditForm({ client, plans, transactions }: { client: any, plans: any[], transactions?: any[] }) {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(updateClient.bind(null, client.id), initialState);
    const [showTransactionForm, setShowTransactionForm] = useState(false);

    useEffect(() => {
        if (state?.success) {
            toast.success("Client details updated successfully!");
        } else if (state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    const handleRenew = async () => {
        if (!confirm("Are you sure you want to renew this client? This will forward the start date and reset the amount paid.")) return;
        const result = await renewClient(client.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    // Calculations for initial state
    const customPrice = Number(client.customPrice);
    const amountPaid = Number(client.amountPaid);
    const dueAmount = customPrice - amountPaid;
    const renewalPrice = Number(client.renewalPrice);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
                <form action={dispatch}>
                    <div className="space-y-6">
                        <div className="bg-card-bg rounded-3xl p-8 border border-card-border shadow-sm">
                            <h2 className="text-xl font-bold text-foreground mb-6">Client Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Client Name</label>
                                    <input name="name" defaultValue={client.name} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Domain</label>
                                    <input name="domain" defaultValue={client.domain} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Plan</label>
                                    <select name="planId" defaultValue={client.planId || ""} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none">
                                        <option value="">No Plan</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Default: ₹{Number(p.price)})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">Billing Status</label>
                                    <select name="billingStatus" defaultValue={client.billingStatus} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none">
                                        <option value="UNPAID">Unpaid</option>
                                        <option value="PAID">Paid</option>
                                        <option value="OVERDUE">Overdue</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-card-border">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Subscription Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Start Date</label>
                                        <input type="date" name="startDate" defaultValue={client.startDate ? client.startDate.toISOString().split('T')[0] : ''} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Billing Cycle</label>
                                        <select name="billingCycle" defaultValue={client.billingCycle} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none">
                                            <option value="MONTHLY">Monthly</option>
                                            <option value="YEARLY">Yearly</option>
                                            <option value="WEEKLY">Weekly</option>
                                            <option value="DAILY">Daily</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Duration (Multiplier)</label>
                                        <input type="number" name="billingPeriod" defaultValue={client.billingPeriod} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Domain Management */}
                            <div className="mt-6 pt-6 border-t border-card-border">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Domain Management</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Provider</label>
                                        <input name="domainProvider" placeholder="e.g. GoDaddy" defaultValue={client.domainProvider || ''} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Bought At</label>
                                        <input type="date" name="domainBoughtAt" defaultValue={client.domainBoughtAt ? client.domainBoughtAt.toISOString().split('T')[0] : ''} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">Expiry Date</label>
                                        <input type="date" name="domainExpiry" defaultValue={client.domainExpiry ? client.domainExpiry.toISOString().split('T')[0] : ''} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card-bg rounded-3xl p-8 border border-card-border shadow-sm">
                            <h2 className="text-xl font-bold text-foreground mb-6">Payment Notes & Terms</h2>
                            <textarea
                                name="description"
                                defaultValue={client.description || ""}
                                placeholder="e.g. 50% Advance paid on Jan 1st, 50% due on Deployment..."
                                className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none"
                            />
                        </div>
                    </div>
                    {/* Hidden Inputs for Financials to be submitted with main form */}
                    <input type="hidden" name="customPrice" value={customPrice} />
                    <input type="hidden" name="amountPaid" value={amountPaid} />
                    <input type="hidden" name="renewalPrice" value={renewalPrice} />

                    <button type="submit" className="hidden" id="main-form-submit" />
                </form>

                {/* Transaction History */}
                <div className="bg-card-bg rounded-3xl p-8 border border-card-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-foreground">Transaction History</h2>
                        <button
                            type="button"
                            onClick={() => setShowTransactionForm(!showTransactionForm)}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
                        >
                            {showTransactionForm ? 'Cancel' : '+ Add Transaction'}
                        </button>
                    </div>

                    {showTransactionForm && (
                        <div className="mb-6 p-6 bg-background rounded-2xl border border-card-border animate-in slide-in-from-top-2">
                            <TransactionForm clientId={client.id} onClose={() => setShowTransactionForm(false)} />
                        </div>
                    )}

                    <div className="space-y-4">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((tx: any) => (
                                <div key={tx.id} className="flex justify-between items-center p-4 bg-background rounded-2xl border border-card-border">
                                    <div>
                                        <p className="font-semibold text-foreground">₹{Number(tx.amount).toFixed(2)}</p>
                                        <p className="text-xs text-secondary">{new Date(tx.date).toLocaleDateString()} • {tx.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-foreground">{tx.description || "No description"}</p>
                                        <p className="text-xs text-secondary">{tx.method || "N/A"}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-secondary text-sm text-center py-4">No transactions recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Financials Side Panel */}
            <div className="space-y-6">
                <form action={dispatch}>
                    {/* Re-include inputs here so they can be edited and saved from this sidebar specifically if needed, 
                     or just use the main form. For now, since we split the form, we need to ensure values propagate.
                     User expectation is likely "Save Changes" saves everything. 
                     Simplest way: One big form is best, but we need the 'Transaction' form to be separate.
                     So we kept the main form wrapping the left side.
                     The right side inputs should ideally be part of that form or synced.
                     
                     FIX: The previous code had the form wrapping everything. 
                     Now we have `form` wrapping the left side, and `form` wrapping the sidebar? No.
                     Let's make the sidebar inputs controlled or part of the main form via portal or just layout.
                     
                     Actually, standard HTML allow form elements outside if using `form="form-id"`.
                     Let's use that approach to keep the layout clean.
                  */}
                    <div className="bg-card-bg rounded-3xl p-6 border border-card-border shadow-sm sticky top-6">
                        <h2 className="text-lg font-bold text-foreground mb-4">Financial Overview</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-secondary uppercase tracking-wider block mb-1">Total Project Cost</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-secondary">₹</span>
                                    <input form="main-form" name="customPrice" type="number" step="0.01" defaultValue={customPrice} className="w-full bg-background border border-card-border rounded-xl pl-8 pr-4 py-3 text-foreground font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-secondary uppercase tracking-wider block mb-1">Amount Paid (Total)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-green-500">₹</span>
                                    <input form="main-form" name="amountPaid" type="number" step="0.01" defaultValue={amountPaid} className="w-full bg-background border border-card-border rounded-xl pl-8 pr-4 py-3 text-foreground font-bold text-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" />
                                </div>
                                <p className="text-xs text-secondary mt-1">Updates automatically via Transactions</p>
                            </div>

                            <div className="p-4 bg-background rounded-2xl border border-card-border">
                                <label className="text-xs text-secondary uppercase tracking-wider block mb-1">Due Amount</label>
                                <div className={`text-2xl font-bold ${dueAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    ₹{dueAmount.toFixed(2)}
                                </div>
                                <p className="text-xs text-secondary mt-1">Calculated automatically</p>
                            </div>

                            <div className="pt-4 border-t border-card-border">
                                <label className="text-xs text-secondary uppercase tracking-wider block mb-1">Renewal Price (Next Cycle)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-secondary">₹</span>
                                    <input form="main-form" name="renewalPrice" type="number" step="0.01" defaultValue={renewalPrice} className="w-full bg-background border border-card-border rounded-xl pl-8 pr-4 py-3 text-foreground font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                                <p className="text-xs text-secondary mt-2">
                                    The amount to be charged when the current plan expires.
                                </p>
                            </div>
                        </div>

                        {/* Main Save Button triggers the main form */}
                        <button
                            type="button"
                            onClick={() => (document.getElementById('main-form') as HTMLFormElement)?.requestSubmit()}
                            className="w-full mt-8 bg-foreground text-background font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-foreground/10"
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={handleRenew}
                            className="w-full mt-4 bg-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary/20 transition-colors"
                        >
                            Renew Subscription
                        </button>

                        {state.message && (
                            <p className="mt-4 text-center text-sm font-medium text-red-500 bg-red-50 p-2 rounded">{state.message}</p>
                        )}
                    </div>
                </form>
            </div>

            {/* Hidden form for ID linkage hack if needed, but we'll use form="main-form" on inputs */}
            {/* We need to wrap the main part in a form with id="main-form" */}
            <form id="main-form" action={dispatch} className="hidden"></form>
        </div>
    );
}

function TransactionForm({ clientId, onClose }: { clientId: string, onClose: () => void }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('PAYMENT');
    const [method, setMethod] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await addTransaction(clientId, Number(amount), description, type as any, method);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            onClose();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-secondary mb-1">Amount</label>
                    <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-background border border-card-border rounded-xl px-3 py-2" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-secondary mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-background border border-card-border rounded-xl px-3 py-2">
                        <option value="PAYMENT">Payment</option>
                        <option value="ADJUSTMENT">Adjustment</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-secondary mb-1">Description</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-background border border-card-border rounded-xl px-3 py-2" />
            </div>
            <div>
                <label className="block text-xs font-medium text-secondary mb-1">Method (UPI, Cash, etc)</label>
                <input type="text" value={method} onChange={e => setMethod(e.target.value)} className="w-full bg-background border border-card-border rounded-xl px-3 py-2" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-secondary hover:text-foreground">Cancel</button>
                <button disabled={loading} type="submit" className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold">{loading ? 'Adding...' : 'Add Transaction'}</button>
            </div>
        </form>
    )
}
