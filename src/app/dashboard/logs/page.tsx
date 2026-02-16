
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import LogList from './log-list';
import PageHeader from '@/app/ui/page-header';

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
            <PageHeader
                title="Audit Logs"
                description={
                    <span className="font-mono text-xs opacity-70">tail -f /var/log/system.log</span>
                }
                icon="_"
                actions={
                    <div className="hidden sm:block">
                        <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                            ● System Online
                        </span>
                    </div>
                }
            />

            <div className="rounded-3xl bg-[#0c0a09] border border-card-border overflow-hidden shadow-2xl">
                <div className="bg-[#1c1917] px-4 py-2 border-b border-card-border flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="text-[10px] text-secondary/50 font-mono ml-2">bash — 80x24</span>
                </div>

                <LogList logs={logs} />
            </div>
        </div>
    );
}
