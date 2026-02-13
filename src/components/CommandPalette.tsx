
"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
    MagnifyingGlassIcon,
    UserPlusIcon,
    PresentationChartBarIcon,
    DocumentTextIcon,
    QueueListIcon,
    HomeIcon
} from "@heroicons/react/24/outline";

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-secondary bg-background border border-card-border rounded-xl hover:border-primary transition-colors w-full md:w-64 shadow-sm"
            >
                <MagnifyingGlassIcon className="w-4 h-4" />
                <span>Search...</span>
                <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-card-border bg-card-bg px-1.5 font-mono text-[10px] font-medium text-secondary ml-auto">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Search"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background rounded-xl shadow-2xl border border-card-border overflow-hidden z-50 p-2 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="flex items-center border-b border-card-border px-3" cmdk-input-wrapper="">
                    <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2 scrollbar-hide">
                    <Command.Empty className="py-6 text-center text-sm text-secondary">No results found.</Command.Empty>

                    <Command.Group heading="Navigation" className="text-secondary text-xs uppercase font-medium px-2 py-1.5">
                        <Command.Item
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/10 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer"
                            onSelect={() => runCommand(() => router.push("/dashboard"))}
                        >
                            <HomeIcon className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Command.Item>
                        <Command.Item
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/10 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer"
                            onSelect={() => runCommand(() => router.push("/dashboard/plans"))}
                        >
                            <QueueListIcon className="mr-2 h-4 w-4" />
                            <span>Plans</span>
                        </Command.Item>
                        <Command.Item
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/10 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer"
                            onSelect={() => runCommand(() => router.push("/dashboard/showcase"))}
                        >
                            <PresentationChartBarIcon className="mr-2 h-4 w-4" />
                            <span>Showcase</span>
                        </Command.Item>
                        <Command.Item
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/10 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer"
                            onSelect={() => runCommand(() => router.push("/docs"))}
                        >
                            <DocumentTextIcon className="mr-2 h-4 w-4" />
                            <span>Documentation</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="my-1 h-px bg-card-border" />

                    <Command.Group heading="Quick Actions" className="text-secondary text-xs uppercase font-medium px-2 py-1.5">
                        <Command.Item
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-primary/10 aria-selected:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer"
                            onSelect={() => runCommand(() => router.push("/dashboard/create"))}
                        >
                            <UserPlusIcon className="mr-2 h-4 w-4" />
                            <span>New Client</span>
                        </Command.Item>
                        {/* Add more actions here */}
                    </Command.Group>
                </Command.List>
            </Command.Dialog>

            {/* Overlay */}
            {open && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />}
        </>
    );
}
