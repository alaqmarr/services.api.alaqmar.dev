
'use client';

// Icons
import {
    PencilSquareIcon,
    TrashIcon,
    BoltIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline'; // Using outline for consistency
import Link from 'next/link';
import { toggleMaintenanceMode } from '@/lib/actions';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

type Client = {
    id: string;
    name: string;
    domain: string;
    billingStatus: string;
    maintenanceMode: boolean;
    plan: { name: string } | null;
    domainExpiry: Date | null;
};

export default function ClientGrid({ clients }: { clients: Client[] }) {

    const handleMaintenanceToggle = async (id: string, currentStatus: boolean) => {
        const result = await toggleMaintenanceMode(id, currentStatus);
        if (result.success) {
            toast.success("Maintenance mode updated");
        } else {
            toast.error("Failed to update");
        }
    };

    if (clients.length === 0) {
        return (
            <div className="text-center py-20 bg-card-bg rounded-3xl border border-dashed border-card-border">
                <p className="text-secondary">No clients found. Create one to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
                <div key={client.id} className="group relative bg-card-bg rounded-3xl border border-card-border p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between h-full">

                    {/* Header: Name & Plan */}
                    <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-foreground truncate pr-2" title={client.name}>
                                {client.name}
                            </h3>
                            {client.plan && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary">
                                    {client.plan.name}
                                </span>
                            )}
                        </div>
                        {client.domain ? (
                            <a href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                <GlobeAltIcon className="w-3 h-3" />
                                {client.domain}
                            </a>
                        ) : (
                            <p className="text-sm text-secondary italic">No domain linked</p>
                        )}
                    </div>

                    {/* Stats / Badges */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-secondary">Status</span>
                            <span className={`px-2 py-0.5 rounded font-bold uppercase ${client.billingStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' :
                                    client.billingStatus === 'OVERDUE' ? 'bg-red-500/10 text-red-500' :
                                        'bg-amber-500/10 text-amber-500'
                                }`}>
                                {client.billingStatus}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-secondary">Renewal</span>
                            <span className="text-foreground font-mono">
                                {client.domainExpiry ? format(new Date(client.domainExpiry), 'MMM d, yyyy') : '-'}
                            </span>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-4 border-t border-card-border flex items-center justify-between">
                        {/* Maintenance Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleMaintenanceToggle(client.id, client.maintenanceMode)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${client.maintenanceMode
                                        ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                                        : 'bg-card-border/50 text-secondary hover:text-foreground'
                                    }`}
                                title="Toggle Maintenance Mode"
                            >
                                <BoltIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Edit Link */}
                        <Link
                            href={`/dashboard/clients/${client.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-secondary/10 hover:bg-primary/20 hover:text-primary px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <PencilSquareIcon className="w-3 h-3" />
                            Manage
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
