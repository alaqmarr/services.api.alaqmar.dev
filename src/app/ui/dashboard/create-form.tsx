'use client';

import { createClient, State } from '@/lib/actions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreateForm({ plans }: { plans?: any[] }) {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createClient, initialState);

    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [customPrice, setCustomPrice] = useState<string>("");
    const [amountPaid, setAmountPaid] = useState<string>("");

    // Auto-fill price when plan changes
    useEffect(() => {
        if (selectedPlanId && plans) {
            const plan = plans.find(p => p.id === selectedPlanId);
            if (plan) {
                setCustomPrice(plan.price.toString());
            }
        }
    }, [selectedPlanId, plans]);

    useEffect(() => {
        if (state?.success && state.client) {
            setShowSuccess(true);
            toast.success("Client created successfully!");
        }
    }, [state]);

    const dueAmount = (parseFloat(customPrice || "0") - parseFloat(amountPaid || "0")).toFixed(2);

    if (showSuccess && state.client) {
        const authUrl = `${window.location.origin}/api/authorize?clientId=${state.client.id}`;
        return (
            <div className="rounded-xl bg-card-bg p-8 shadow-sm border border-primary ring-1 ring-primary/20">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-4 ring-1 ring-primary">
                        <svg className="h-8 w-8 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Client Created!</h3>
                    <p className="mt-2 text-sm text-secondary max-w-sm mx-auto">
                        The client has been successfully added to the database. Save these credentials now.
                        <span className="block text-primary font-medium mt-1 text-xs uppercase tracking-wide">⚠️ Credentials shown only once</span>
                    </p>
                </div>

                <div className="space-y-6 bg-background p-6 rounded-lg border border-card-border">
                    <div>
                        <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Client Name</label>
                        <div className="text-base font-medium text-foreground">{state.client.name}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">API Key</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={state.client.apiKey}
                                className="flex-1 block w-full rounded-none rounded-l-md border-card-border bg-card-bg p-2.5 text-sm text-foreground font-mono focus:ring-primary focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(state.client.apiKey); toast.success("Copied!"); }}
                                className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-card-border text-sm font-medium rounded-r-md text-secondary bg-background hover:bg-card-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Auth URL</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={authUrl}
                                className="flex-1 block w-full rounded-none rounded-l-md border-card-border bg-card-bg p-2.5 text-sm text-secondary focus:ring-primary focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(authUrl); toast.success("Copied!"); }}
                                className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-card-border text-sm font-medium rounded-r-md text-secondary bg-background hover:bg-card-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-background bg-foreground hover:bg-black dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form action={dispatch} className="bg-card-bg rounded-xl shadow-sm border border-card-border p-8">
            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Client Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 uppercase tracking-tight placeholder-secondary"
                        aria-describedby="name-error"
                        required
                    />
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="client@company.com"
                        className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 placeholder-secondary"
                        aria-describedby="email-error"
                    />
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Domain */}
                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-foreground mb-1">
                        Domain
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-secondary sm:text-sm">https://</span>
                        </div>
                        <input
                            type="text"
                            name="domain"
                            id="domain"
                            className="block w-full rounded-lg border-card-border bg-background text-foreground pl-16 focus:border-primary focus:ring-primary sm:text-sm py-2.5 pr-3 placeholder-secondary"
                            placeholder="www.example.com"
                            aria-describedby="domain-error"
                            required
                        />
                    </div>
                    <div id="domain-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.domain &&
                            state.errors.domain.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="border-t border-card-border pt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Plan & Billing</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Plan Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Subscription Plan</label>
                            <select
                                name="planId"
                                value={selectedPlanId}
                                onChange={(e) => setSelectedPlanId(e.target.value)}
                                className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                            >
                                <option value="">Select a Plan</option>
                                {plans?.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name} - ₹{plan.price} / {plan.durationUnit}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Billing Cycle (Hidden if plan selected, or optional override) */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Billing Cycle</label>
                            <div className="flex gap-4 items-start">
                                <div className="w-24 flex-shrink-0">
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            name="billingPeriod"
                                            id="period"
                                            min="1"
                                            defaultValue="1"
                                            className="block w-full rounded-lg border-card-border bg-background text-foreground focus:border-primary focus:ring-primary sm:text-sm py-3 px-3 text-center font-semibold"
                                            placeholder="1"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none">
                                            <span className="text-secondary text-xs mr-1">x</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <select
                                        name="billingCycle"
                                        className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-3"
                                        defaultValue="MONTHLY"
                                    >
                                        <option value="DAILY">Days</option>
                                        <option value="WEEKLY">Weeks</option>
                                        <option value="MONTHLY">Months</option>
                                        <option value="YEARLY">Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-background p-4 rounded-xl border border-card-border">
                        {/* Total Cost */}
                        <div>
                            <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Total Cost (₹)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-foreground sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    name="customPrice"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    className="block w-full rounded-lg border-card-border bg-card-bg text-foreground pl-8 focus:border-primary focus:ring-primary sm:text-sm py-2.5 font-bold"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Amount Paid */}
                        <div>
                            <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Amount Paid (₹)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-green-600 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    name="amountPaid"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    className="block w-full rounded-lg border-card-border bg-card-bg text-foreground pl-8 focus:border-primary focus:ring-primary sm:text-sm py-2.5 font-bold"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Due Amount */}
                        <div>
                            <label className="block text-xs font-medium text-secondary uppercase tracking-wider mb-2">Due Amount</label>
                            <div className={`text-xl font-bold py-2 ${parseFloat(dueAmount) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                ₹ {dueAmount}
                            </div>
                            <input type="hidden" name="billingStatus" value={parseFloat(dueAmount) > 0 ? "UNPAID" : "PAID"} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Renewal Price */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Renewal Price (₹)</label>
                            <input
                                type="number"
                                name="renewalPrice"
                                placeholder="Amount to be charged on renewal"
                                className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                                step="0.01"
                            />
                            <p className="text-xs text-secondary mt-1">Leave empty to use Plan default</p>
                        </div>

                        {/* Description/Terms */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Payment Terms / Notes</label>
                            <textarea
                                name="description"
                                placeholder="e.g. 50% Advance, 50% on Deployment"
                                className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 h-[86px] resize-none"
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-foreground mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="block w-full rounded-lg border-card-border bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3"
                        />
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{state.message}</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-x-4">
                <Link
                    href="/dashboard"
                    className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-black dark:hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-all"
                >
                    Create Client
                </button>
            </div>
        </form>
    );
}


function LabelRadio({ id, name, value, label, defaultChecked, colorClass }: any) {
    return (
        <div>
            <input
                type="radio"
                name={name}
                id={id}
                value={value}
                className="peer sr-only"
                defaultChecked={defaultChecked}
            />
            <label
                htmlFor={id}
                className={`flex items-center justify-center rounded-lg border border-card-border bg-background px-3 py-3 text-sm font-medium text-secondary hover:bg-card-bg hover:text-foreground peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 cursor-pointer transition-all ${colorClass}`}
            >
                {label}
            </label>
        </div>
    )
}
