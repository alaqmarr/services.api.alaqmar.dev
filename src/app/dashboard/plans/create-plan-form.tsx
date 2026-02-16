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
        <form id="create-plan-form" action={dispatch} className="bg-card-bg rounded-3xl p-6 border border-card-border shadow-lg space-y-5 sticky top-6">
            <div className="flex items-center gap-3 mb-2 border-b border-card-border pb-4">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-lg">
                    <span>＋</span>
                </div>
                <div>
                    <h2 className="text-base font-bold text-foreground">Create Plan</h2>
                    <p className="text-xs text-secondary mt-0.5">Add a new billing tier.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Plan Name</label>
                    <input id="name" name="name" type="text" placeholder="e.g. Standard Hosting" required
                        className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="price" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Price (₹)</label>
                        <input id="price" name="price" type="number" step="0.01" placeholder="0.00" required
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                    </div>
                    <div>
                        <label htmlFor="validity" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Validity</label>
                        <input id="validity" name="validity" type="number" placeholder="1" defaultValue="1" required
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner" />
                    </div>
                </div>

                <div>
                    <label htmlFor="durationUnit" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5">Duration Unit</label>
                    <div className="relative">
                        <select id="durationUnit" name="durationUnit" defaultValue="MONTH"
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none shadow-inner cursor-pointer">
                            <option value="DAY">Day</option>
                            <option value="WEEK">Week</option>
                            <option value="MONTH">Month</option>
                            <option value="YEAR">Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="inclusions" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5 text-emerald-500/80">Inclusions</label>
                        <textarea id="inclusions" name="inclusions" rows={4} placeholder="One per line..."
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner resize-none font-mono text-xs" />
                    </div>
                    <div>
                        <label htmlFor="exclusions" className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1.5 text-red-400/80">Exclusions</label>
                        <textarea id="exclusions" name="exclusions" rows={4} placeholder="One per line..."
                            className="w-full rounded-xl border border-card-border bg-black/20 px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner resize-none font-mono text-xs" />
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-card-border/50 cursor-pointer hover:border-primary/30 transition-colors">
                    <input id="displayOnPortfolio" name="displayOnPortfolio" type="checkbox" className="h-4 w-4 rounded border-card-border text-primary focus:ring-primary/20 bg-card-bg" />
                    <label htmlFor="displayOnPortfolio" className="text-sm font-medium text-foreground cursor-pointer select-none">Show on portfolio</label>
                </div>
            </div>

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-secondary to-secondary/80 px-4 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Create Plan
            </button>
        </form>
    );
}
