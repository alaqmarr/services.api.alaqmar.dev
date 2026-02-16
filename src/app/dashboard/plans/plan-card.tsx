'use client';

import { useState } from 'react';
import { deletePlan } from '@/lib/actions';

interface PlanProps {
    plan: {
        id: string;
        name: string;
        price: number | object; // Prisma Decimal is object-like in client
        validity: number;
        durationUnit: string;
        inclusions: string[];
        exclusions: string[];
        displayOnPortfolio: boolean;
    }
}

export default function PlanCard({ plan }: PlanProps) {
    const [expanded, setExpanded] = useState(false);

    // Helper to format price since Decimal comes as string/object
    const price = Number(plan.price).toLocaleString();

    return (
        <div
            className={`relative flex flex-col justify-between overflow-hidden rounded-3xl bg-card-bg border border-card-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group ${expanded ? 'row-span-2' : ''}`}
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{plan.name}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">₹{price}</span>
                        <span className="text-xs text-secondary">/{plan.validity} {plan.durationUnit.toLowerCase()}{plan.validity > 1 ? 's' : ''}</span>
                    </div>
                </div>
                {plan.displayOnPortfolio && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                        Public
                    </span>
                )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6 flex-grow">
                {plan.inclusions.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Includes</p>
                        <ul className="space-y-1">
                            {(expanded ? plan.inclusions : plan.inclusions.slice(0, 3)).map((inc, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <span className="text-emerald-500 mt-0.5 min-w-[10px]">✓</span>
                                    <span>{inc}</span>
                                </li>
                            ))}
                            {!expanded && plan.inclusions.length > 3 && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="text-[10px] text-primary hover:underline pl-4 cursor-pointer font-medium"
                                >
                                    + {plan.inclusions.length - 3} more (Show all)
                                </button>
                            )}
                        </ul>
                    </div>
                )}

                {/* Divider - only show if expanded or if exclusions exist and inclusions are few */}
                {plan.inclusions.length > 0 && plan.exclusions.length > 0 && <div className="h-px bg-card-border/50"></div>}

                {plan.exclusions.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Excludes</p>
                        <ul className="space-y-1">
                            {(expanded ? plan.exclusions : plan.exclusions.slice(0, 2)).map((exc, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-secondary/70">
                                    <span className="text-red-400 mt-0.5 min-w-[10px]">✗</span>
                                    <span>{exc}</span>
                                </li>
                            ))}
                            {!expanded && plan.exclusions.length > 2 && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    className="text-[10px] text-secondary hover:text-foreground pl-4 cursor-pointer"
                                >
                                    + {plan.exclusions.length - 2} more
                                </button>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-card-border pt-4 mt-auto">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs font-medium text-secondary hover:text-foreground transition-colors"
                >
                    {expanded ? '▲ Collapse' : '▼ Expand'}
                </button>

                <form action={async () => { await deletePlan(plan.id); }}>
                    <button className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20">
                        Delete Plan
                    </button>
                </form>
            </div>
        </div>
    );
}
