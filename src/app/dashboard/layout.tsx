import SideNav from '@/app/ui/dashboard/sidenav';
import { CommandPalette } from '@/components/CommandPalette';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden relative">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow flex flex-col h-full">
                {/* Mobile Header / Top Bar for Desktop Search */}
                <div className="md:hidden bg-background border-b border-card-border p-4 flex justify-end">
                    <CommandPalette />
                </div>

                {/* Desktop Search Overlay Trigger (Absolute or Fixed? Or just in the corner?) */}
                {/* For now let's put it in the top right of the main content area or made accessible via hotkey only? 
                    Better to have a visible trigger. 
                */}
                <div className="hidden md:block absolute top-4 right-8 z-10">
                    <CommandPalette />
                </div>

                <div className="flex-grow p-6 md:overflow-y-auto md:p-12 overflow-x-hidden pt-16 md:pt-12">
                    {children}
                </div>
            </div>
        </div>
    );
}
