'use client';

import { useState, Fragment } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface LogItem {
    id: string;
    action: string;
    entityType: string | null;
    entityId: string | null;
    userId: string | null;
    details: string | null;
    createdAt: Date;
}

export default function LogList({ logs }: { logs: LogItem[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap font-mono">
                <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                        <th className="px-6 py-3 text-[10px] font-bold text-secondary uppercase tracking-widest pl-8">Action</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-secondary uppercase tracking-widest">Entity</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-secondary uppercase tracking-widest">User</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-secondary uppercase tracking-widest">Timestamp</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-secondary uppercase tracking-widest">Output</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-sm text-secondary/50 font-mono">
                                &gt; No logs found in buffer...
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <Fragment key={log.id}>
                                <tr
                                    onClick={() => toggleExpand(log.id)}
                                    className={`hover:bg-white/5 transition-colors group cursor-pointer ${expandedId === log.id ? 'bg-white/5' : ''}`}
                                >
                                    <td className="px-6 py-3 text-primary pl-8">
                                        <span className={`opacity-50 text-secondary mr-2 transition-transform inline-block ${expandedId === log.id ? 'rotate-90' : ''}`}>▶</span>
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-3 text-secondary/80">
                                        <span className="text-secondary/40 mr-1">&lt;</span>
                                        {log.entityType || 'unknown'}
                                        <span className="text-secondary/40 ml-1">&gt;</span>
                                        {log.entityId && <span className="opacity-50 ml-1">:{log.entityId.slice(0, 5)}</span>}
                                    </td>
                                    <td className="px-6 py-3 text-secondary/70">
                                        @{log.userId || 'system'}
                                    </td>
                                    <td className="px-6 py-3 text-secondary/50 text-xs">
                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                    </td>
                                    <td className="px-6 py-3 text-foreground/80 text-xs max-w-xs truncate group-hover:text-foreground">
                                        {log.details ? (log.details.length > 50 ? log.details.slice(0, 50) + '...' : log.details) : '# OK'}
                                    </td>
                                </tr>
                                {expandedId === log.id && (
                                    <tr className="bg-black/20">
                                        <td colSpan={5} className="px-8 py-4">
                                            <div className="bg-[#0c0a09] border border-white/10 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                                                <div className="flex items-center gap-2 mb-2 text-secondary/50 pb-2 border-b border-white/5">
                                                    <span>DETAILS</span>
                                                    <span className="flex-grow h-px bg-white/5"></span>
                                                    <span>JSON</span>
                                                </div>
                                                <pre className="text-green-400/90 whitespace-pre-wrap">
                                                    {(() => {
                                                        try {
                                                            return JSON.stringify(JSON.parse(log.details || '{}'), null, 2);
                                                        } catch (e) {
                                                            return log.details || 'No details available.';
                                                        }
                                                    })()}
                                                </pre>
                                                <div className="mt-3 pt-2 border-t border-white/5 text-secondary/40 flex justify-between">
                                                    <span>UUID: {log.id}</span>
                                                    <span>Full Timestamp: {new Date(log.createdAt).toISOString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
