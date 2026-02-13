
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Audit Logs | Alaqmar',
};

export default async function LogsPage() {
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Audit Logs</h1>
                <p className="text-sm text-secondary mt-1">Track system activity and changes.</p>
            </div>

            <div className="rounded-2xl bg-card-bg border border-card-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-background/50 border-b border-card-border">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-medium text-secondary uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-secondary">No logs found.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-secondary">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary">
                                                {log.entity}
                                            </span>
                                            {log.entityId && <span className="ml-1 text-xs text-secondary/50 font-mono">#{log.entityId.slice(0, 5)}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-secondary text-xs">
                                            {log.userId || 'system'}
                                        </td>
                                        <td className="px-6 py-4 text-secondary text-xs">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4 text-secondary text-xs max-w-xs truncate font-mono">
                                            {log.metadata ? JSON.stringify(log.metadata) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
