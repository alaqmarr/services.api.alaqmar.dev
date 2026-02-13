import Link from 'next/link';

export default function SideNav() {
    return (
        <div className="flex h-full flex-col px-4 py-6">
            <Link
                className="mb-6 flex h-32 items-end justify-start rounded-3xl bg-gradient-to-br from-[#d4a373] to-[#bc8a5f] p-6 shadow-xl shadow-[#d4a373]/20 group relative overflow-hidden transition-transform hover:scale-[1.02]"
                href="/"
            >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/20 blur-2xl"></div>
                <div className="w-full text-[#fdfcf8] relative z-10">
                    <h2 className="text-xs font-medium opacity-90 uppercase tracking-widest text-[#fdfcf8]/80">Workspace</h2>
                    <h1 className="text-2xl font-bold font-sans tracking-tight mt-1">Alaqmar</h1>
                </div>
            </Link>

            <div className="flex grow flex-col justify-between space-y-2">
                <div className="space-y-2">
                    <div className="px-3 py-2">
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Menu</h3>
                    </div>
                    <NavLinks />
                </div>

                <form
                    action={async () => {
                        'use server';
                        const { signOut } = await import('@/auth');
                        await signOut();
                    }}
                >
                    <button className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-sm font-medium text-secondary hover:bg-card-bg hover:text-foreground transition-all duration-200 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-transparent border border-card-border group-hover:border-red-200 dark:group-hover:border-red-900/30 text-secondary group-hover:text-red-500 transition-colors">
                            <PowerIcon className="w-5" />
                        </div>
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}

function NavLinks() {
    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Showcase', href: '/dashboard/showcase', icon: PresentationChartBarIcon },
        { name: 'Plans', href: '/dashboard/plans', icon: QueueListIcon },
        { name: 'Add Admin', href: '/dashboard/users/create', icon: UserPlusIcon },
        { name: 'Docs', href: '/docs', icon: DocumentTextIcon },
        { name: 'Setup', href: '/setup', icon: CogIcon },
    ];

    return (
        <div className="space-y-1">
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-3 rounded-2xl p-3 text-sm font-medium text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card-bg shadow-sm group-hover:bg-primary/20 transition-colors text-secondary group-hover:text-primary">
                            <LinkIcon className="w-5" />
                        </div>
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </div>
    );
}

// Icons (Updated for softer stroke)
function HomeIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function PowerIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
        </svg>
    )
}

function CogIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function UserPlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
    )
}

function DocumentTextIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    )
}

function QueueListIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    )
}

function PresentationChartBarIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
    )
}
