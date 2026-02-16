
import { prisma } from '@/lib/prisma';
import CreatePlanForm from './create-plan-form';
import { deletePlan } from '@/lib/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plans Management | Alaqmar',
};

export default async function PlansPage() {
    const plans = await prisma.plan.findMany({
        orderBy: { createdAt: 'desc' }, // sortOrder removed, fallback to createdAt
    });

    return (
        <div className="w-full space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Plans</h1>
                <p className="text-sm text-secondary mt-1">Manage your service plans.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                            <div key={plan.id} className="rounded-2xl bg-card-bg border border-card-border p-5 flex flex-col justify-between group hover:border-primary/30 transition-all">
                                <div>
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-bold text-foreground">{plan.name}</h3>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            ₹{Number(plan.price).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-3 text-xs text-secondary mb-3">
                                        <span>📅 {plan.validity} {plan.durationUnit.toLowerCase()}{plan.validity > 1 ? 's' : ''}</span>
                                        {plan.displayOnPortfolio && <span className="text-emerald-600">🌐 Public</span>}
                                    </div>
                                    <div className="flex gap-3 text-xs text-secondary">
                                        <span className="flex items-center gap-1"><span className="text-emerald-500 font-bold">✓</span> {plan.inclusions.length}</span>
                                        <span className="flex items-center gap-1"><span className="text-red-400 font-bold">✗</span> {plan.exclusions.length}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 pt-3 border-t border-card-border">
                                    <form action={async () => { 'use server'; await deletePlan(plan.id); }}>
                                        <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
                                    </form>
                                </div>
                            </div>
                        ))}
                        {plans.length === 0 && (
                            <div className="col-span-full text-center py-12 text-sm text-secondary bg-card-bg rounded-2xl border border-dashed border-card-border">
                                No plans yet.
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky top-6"><CreatePlanForm /></div>
                </div>
            </div>
        </div>
    );
}
