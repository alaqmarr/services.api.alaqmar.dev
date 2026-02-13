'use client';

import { createClient, State } from '@/lib/actions';
import { Plan } from '@/lib/generated/prisma/client';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreateForm({ plans }: { plans: Plan[] }) {
    const initialState: State = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(createClient, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Client created!");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard" className="text-sm text-secondary hover:text-primary transition-colors inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                </Link>
                <h1 className="text-2xl font-bold text-foreground mt-4 tracking-tight">New Client</h1>
                <p className="text-sm text-secondary mt-1">Add a new client to your portfolio.</p>
            </div>

            <form action={dispatch} className="space-y-8">
                <div className="bg-card-bg border border-card-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Client name"
                                required
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                            {state.errors?.name && <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="client@example.com"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                            {state.errors?.email && <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>}
                        </div>

                        {/* Company (removed from form as per schema revert? No, schema DOES NOT have company field anymore! User schema does NOT have company!) */}
                        {/* Wait, my simplified schema had Company. User schema snippets:
                           model Client {
                             name, email, domain, billingStatus, maintenanceMode, maintenanceMessage, apiKey, planId, customPrice, amountPaid, renewalPrice, description, isBlocked, billingCycle, billingPeriod, startDate, domainExpiry, domainBoughtAt, domainProvider, transactions, createdAt, updatedAt
                           }
                           NO COMPANY FIELD!
                           So I should REMOVE company field.
                           And I should ADD domain field (required as per schema but let's make it optional in form if possible, but schema says @unique so it must be present? Schema: domain String @unique. It is REQUIRED.)
                        */}
                    </div>
                </div>

                <div className="bg-card-bg border border-card-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Domain & Hosting</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Domain */}
                        <div>
                            <label htmlFor="domain" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Domain <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="domain"
                                name="domain"
                                type="text"
                                placeholder="example.com"
                                required
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                            {state.errors?.domain && <p className="text-xs text-red-500 mt-1">{state.errors.domain[0]}</p>}
                        </div>

                        {/* Domain Provider */}
                        <div>
                            <label htmlFor="domainProvider" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Provider
                            </label>
                            <input
                                id="domainProvider"
                                name="domainProvider"
                                type="text"
                                placeholder="GoDaddy, Hostinger..."
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                        </div>

                        {/* Bought At */}
                        <div>
                            <label htmlFor="domainBoughtAt" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Bought At
                            </label>
                            <input
                                id="domainBoughtAt"
                                name="domainBoughtAt"
                                type="date"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                        </div>

                        {/* Expiry */}
                        <div>
                            <label htmlFor="domainExpiry" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Expiry Date
                            </label>
                            <input
                                id="domainExpiry"
                                name="domainExpiry"
                                type="date"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-card-bg border border-card-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Subscription & Billing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Plan */}
                        <div>
                            <label htmlFor="planId" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Plan
                            </label>
                            <select
                                id="planId"
                                name="planId"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm appearance-none"
                            >
                                <option value="">Select a plan...</option>
                                {plans.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name} - ₹{parseFloat(plan.price.toString())} ({plan.durationUnit})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Billing Status */}
                        <div>
                            <label htmlFor="billingStatus" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Status
                            </label>
                            <select
                                id="billingStatus"
                                name="billingStatus"
                                defaultValue="UNPAID"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm appearance-none"
                            >
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                                <option value="OVERDUE">Overdue</option>
                            </select>
                        </div>

                        {/* Custom Price */}
                        <div>
                            <label htmlFor="customPrice" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Custom Price (₹)
                            </label>
                            <input
                                id="customPrice"
                                name="customPrice"
                                type="number"
                                placeholder="0.00"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                        </div>

                        {/* Renewal Price */}
                        <div>
                            <label htmlFor="renewalPrice" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Renewal Price (₹)
                            </label>
                            <input
                                id="renewalPrice"
                                name="renewalPrice"
                                type="number"
                                placeholder="0.00"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                        </div>

                        {/* Billing Cycle */}
                        <div>
                            <label htmlFor="billingCycle" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Billing Cycle
                            </label>
                            <select
                                id="billingCycle"
                                name="billingCycle"
                                defaultValue="MONTHLY"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm appearance-none"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                        </div>

                        {/* Subscription Period */}
                        <div>
                            <label htmlFor="subscriptionPeriod" className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">
                                Period Length
                            </label>
                            <input
                                id="subscriptionPeriod"
                                name="subscriptionPeriod"
                                type="number"
                                defaultValue="1"
                                className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                        Create Client
                    </button>
                    <Link
                        href="/dashboard"
                        className="rounded-xl border border-card-border bg-card-bg px-6 py-3 text-sm font-medium text-secondary hover:text-foreground transition-colors text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
