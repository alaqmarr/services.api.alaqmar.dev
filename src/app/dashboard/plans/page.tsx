import { prisma } from '@/lib/prisma';
import CreatePlanForm from './create-plan-form';
import { deletePlan } from '@/lib/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Plans Management | Alaqmar',
};

export default async function PlansPage() {
    const plans = await prisma.plan.findMany({
        orderBy: { price: 'asc' },
        include: { _count: { select: { clients: true } } }
    });

    return (
        <div className="w-full space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Plans & Billing</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Plans */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-card-bg rounded-3xl p-6 border border-card-border shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-all duration-200">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                            ₹{Number(plan.price).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 mb-4">
                                        <div className="text-xs text-secondary">
                                            <span className="font-bold text-green-600">✓</span> {plan.inclusions.length} Included
                                        </div>
                                        <div className="text-xs text-secondary">
                                            <span className="font-bold text-red-500">✗</span> {plan.exclusions.length} Excluded
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-secondary mb-6">
                                        <span className="flex items-center gap-1">
                                            <span className="text-lg">📅</span> {plan.validity} Months
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="text-lg">👥</span> {plan._count.clients} Clients
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-card-border">
                                    <form action={async () => {
                                        'use server';
                                        await deletePlan(plan.id);
                                    }}>
                                        <button className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                            Delete Plan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                        {plans.length === 0 && (
                            <div className="col-span-full text-center py-12 text-secondary bg-card-bg rounded-3xl border border-dashed border-card-border">
                                No plans created yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <CreatePlanForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
