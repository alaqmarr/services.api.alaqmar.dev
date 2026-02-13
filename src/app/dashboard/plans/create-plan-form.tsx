'use client';

import { createPlan, State } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreatePlanForm() {
    const initialState: State = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(createPlan, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Plan created!");
            const form = document.getElementById('create-plan-form') as HTMLFormElement;
            if (form) form.reset();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form id="create-plan-form" action={dispatch} className="bg-card-bg rounded-2xl p-6 border border-card-border space-y-4">
            <div>
                <h2 className="text-sm font-bold text-foreground">Create Plan</h2>
                <p className="text-xs text-secondary mt-0.5">Add a new billing plan.</p>
            </div>

            <div className="space-y-3">
                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Plan Name</label>
                    <input id="name" name="name" type="text" placeholder="e.g. Standard Hosting" required
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="price" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Price (₹)</label>
                        <input id="price" name="price" type="number" step="0.01" placeholder="0.00" required
                            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label htmlFor="validity" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Validity</label>
                        <input id="validity" name="validity" type="number" placeholder="1" defaultValue="1" required
                            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                </div>

                <div>
                    <label htmlFor="durationUnit" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Duration Unit</label>
                    <select id="durationUnit" name="durationUnit" defaultValue="MONTH"
                        className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="DAY">Day</option>
                        <option value="WEEK">Week</option>
                        <option value="MONTH">Month</option>
                        <option value="YEAR">Year</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="inclusions" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Inclusions</label>
                        <textarea id="inclusions" name="inclusions" rows={3} placeholder="One per line"
                            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                    </div>
                    <div>
                        <label htmlFor="exclusions" className="block text-xs font-medium text-secondary uppercase tracking-wider mb-1">Exclusions</label>
                        <textarea id="exclusions" name="exclusions" rows={3} placeholder="One per line"
                            className="w-full rounded-lg border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-background p-3 rounded-lg border border-card-border/50">
                    <input id="displayOnPortfolio" name="displayOnPortfolio" type="checkbox" className="h-4 w-4 rounded border-card-border text-primary focus:ring-primary/20" />
                    <label htmlFor="displayOnPortfolio" className="text-sm text-foreground cursor-pointer select-none">Show on portfolio</label>
                </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-[0.98]">
                Create Plan
            </button>
        </form>
    );
}
