'use client';

import { createPlan, State } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreatePlanForm() {
    const initialState: State = { message: null, errors: {} };
    // @ts-ignore - excessive typing issue with useFormState
    const [state, dispatch] = useFormState(createPlan, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Operation successful");
            // Optional: Reset form or close modal if we had one
            const form = document.getElementById('create-plan-form') as HTMLFormElement;
            if (form) form.reset();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form id="create-plan-form" action={dispatch} className="bg-card-bg rounded-3xl p-8 border border-card-border shadow-sm space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground">Create New Plan</h2>
                <p className="text-sm text-secondary">Add a new standard billing package.</p>
            </div>

            <div className="space-y-4">
                {/* Plan Name */}
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                        Plan Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Standard Hosting"
                        className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                            Price (₹)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Validity */}
                    <div>
                        <label htmlFor="validity" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                            Validity (Months)
                        </label>
                        <input
                            id="validity"
                            name="validity"
                            type="number"
                            placeholder="12"
                            defaultValue="1"
                            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                            required
                        />
                        <p className="text-[10px] text-secondary mt-1">Duration in months</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Inclusions */}
                    <div>
                        <label htmlFor="inclusions" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                            Inclusions (One per line)
                        </label>
                        <textarea
                            id="inclusions"
                            name="inclusions"
                            rows={3}
                            placeholder="SSL Certificate&#10;Daily Backups"
                            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 resize-none text-sm"
                        />
                    </div>

                    {/* Exclusions */}
                    <div>
                        <label htmlFor="exclusions" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">
                            Exclusions (One per line)
                        </label>
                        <textarea
                            id="exclusions"
                            name="exclusions"
                            rows={3}
                            placeholder="Domain Name&#10;Email Hosting"
                            className="w-full rounded-xl border border-card-border bg-background px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 resize-none text-sm"
                        />
                    </div>
                </div>

                {/* Display On Portfolio */}
                <div className="flex items-center gap-3 bg-secondary/5 p-4 rounded-xl border border-card-border/50">
                    <input
                        id="displayOnPortfolio"
                        name="displayOnPortfolio"
                        type="checkbox"
                        className="h-5 w-5 rounded border-card-border text-primary focus:ring-primary/20"
                    />
                    <label htmlFor="displayOnPortfolio" className="text-sm font-medium text-foreground cursor-pointer select-none">
                        Display this plan on public Portfolio/Website
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98]"
            >
                Create Plan
            </button>
        </form>
    );
}
