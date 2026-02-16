
import { prisma } from '@/lib/prisma';
import CreatePlanForm from './create-plan-form';
import { deletePlan } from '@/lib/actions';
import { Metadata } from 'next';
import PlanCard from './plan-card';
import PageHeader from '@/app/ui/page-header';

export const metadata: Metadata = {
    title: 'Plans Management | Alaqmar',
};

export default async function PlansPage() {
    const plansData = await prisma.plan.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const plans = plansData.map(plan => ({
        ...plan,
        price: Number(plan.price)
    }));

    return (
        <div className="w-full space-y-8">
            <PageHeader
                title="Plans"
                description="Manage service tiers and pricing structures."
                icon="💠"
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Plans Grid */}
                <div className="xl:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                        {plans.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-card-bg border border-dashed border-card-border">
                                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3 text-2xl">📋</div>
                                <h3 className="text-base font-medium text-foreground">No plans active</h3>
                                <p className="text-secondary text-xs max-w-xs mt-1">Create your first pricing tier.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="xl:col-span-1">
                    <div className="sticky top-6"><CreatePlanForm /></div>
                </div>
            </div>
        </div>
    );
}
