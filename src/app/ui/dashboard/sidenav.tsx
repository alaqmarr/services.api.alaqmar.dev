
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
// Icons
import {
    HomeIcon,
    PresentationChartBarIcon,
    QueueListIcon,
    DocumentTextIcon,
    UserPlusIcon,
    CogIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline'; // Importing directly to ensure correct imports

export default function SideNav() {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Showcase', href: '/dashboard/showcase', icon: PresentationChartBarIcon },
        { name: 'Plans', href: '/dashboard/plans', icon: QueueListIcon },
        { name: 'Logs', href: '/dashboard/logs', icon: DocumentTextIcon },
        { name: 'Add Admin', href: '/dashboard/users/create', icon: UserPlusIcon },
        { name: 'Docs', href: '/docs', icon: BookOpenIcon },
    ];

    return (
        <div className="flex h-full flex-col justify-between bg-card-bg border-r border-card-border md:w-20 w-full md:flex-col flex-row">
            {/* Logo / Brand Icon (Desktop Top, Mobile Hidden or Top Left) */}
            <div className="hidden md:flex h-20 items-center justify-center border-b border-card-border">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-xl">
                    🚀
                </div>
            </div>

            {/* Links */}
            <div className="flex flex-row md:flex-col items-center justify-around md:justify-start md:space-y-4 md:p-4 w-full h-16 md:h-auto overflow-x-auto md:overflow-visible">
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            title={link.name}
                            className={clsx(
                                "group flex items-center justify-center rounded-xl p-3 transition-all duration-200",
                                isActive
                                    ? "bg-primary/20 text-primary shadow-lg shadow-primary/10"
                                    : "text-secondary hover:bg-white/5 hover:text-foreground"
                            )}
                        >
                            <LinkIcon className="w-6 h-6" />
                            <span className="sr-only">{link.name}</span>

                            {/* Desktop Active Indicator */}
                            {isActive && (
                                <div className="hidden md:block absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom/End Actions */}
            <div className="hidden md:flex flex-col items-center p-4 space-y-4 border-t border-card-border">
                <Link
                    href="/setup"
                    title="Setup"
                    className={clsx(
                        "group flex items-center justify-center rounded-xl p-3 transition-all duration-200",
                        pathname === '/setup' ? "bg-primary/20 text-primary" : "text-secondary hover:bg-white/5 hover:text-foreground"
                    )}
                >
                    <CogIcon className="w-6 h-6" />
                </Link>
            </div>
        </div>
    );
}
