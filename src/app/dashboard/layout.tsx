
import SideNav from '@/app/ui/dashboard/sidenav';
import { CommandPalette } from '@/components/CommandPalette';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-background text-foreground relative">

            {/* Sidebar / IDE Bar */}
            <div className="w-full flex-none md:w-20 order-2 md:order-1 border-t md:border-t-0 md:border-r border-card-border bg-card-bg z-30">
                <SideNav />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col h-full order-1 md:order-2 relative">

                {/* Mobile Header (Logo & Search) */}
                <div className="md:hidden bg-card-bg/50 backdrop-blur-md border-b border-card-border p-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="font-bold text-lg tracking-tight">Alaqmar</div>
                    <CommandPalette />
                </div>

                {/* Desktop Search Trigger (Floating) */}
                <div className="hidden md:block absolute top-6 right-8 z-20">
                    <CommandPalette />
                </div>

                {/* Content Scroll Area */}
                <div className="flex-grow h-full overflow-y-auto overflow-x-hidden p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
