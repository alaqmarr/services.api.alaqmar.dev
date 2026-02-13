
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { UserIcon, ClockIcon, DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default async function AuditLogPage() {
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            </div>

            <div className="bg-card-bg rounded-3xl border border-card-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-card-border bg-background/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-secondary">Action</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-secondary">Entity</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-secondary">User</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-secondary">Details</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-secondary">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {logs.map((log) => {
                                let detailsObject = {};
                                try {
                                    detailsObject = log.details ? JSON.parse(log.details) : {};
                                } catch (e) {
                                    detailsObject = { raw: log.details };
                                }

                                return (
                                    <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary">
                                            {log.entityType} <span className="text-xs text-secondary/70">({log.entityId?.slice(-5)})</span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary flex items-center gap-2">
                                            <UserIcon className="w-4 h-4" />
                                            {log.userId || "System"}
                                        </td>
                                        <td className="px-6 py-4 text-secondary max-w-xs truncate" title={JSON.stringify(detailsObject, null, 2)}>
                                            {Object.entries(detailsObject).map(([key, value]) => (
                                                <span key={key} className="mr-2 text-xs bg-background border border-card-border px-1.5 py-0.5 rounded">
                                                    {key}: {JSON.stringify(value)}
                                                </span>
                                            )).slice(0, 3)}
                                        </td>
                                        <td className="px-6 py-4 text-secondary flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4" />
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="p-12 text-center text-secondary">
                            <DocumentMagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-secondary/50" />
                            <p>No audit logs found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
