
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // Using outline for consistency

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="rounded-3xl bg-card-bg border border-card-border p-12 text-center max-w-lg w-full relative overflow-hidden">

                {/* Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-8 ring-1 ring-primary/20">
                    <ExclamationTriangleIcon className="h-10 w-10 text-primary" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                    404 - Signal Lost
                </h2>
                <p className="text-secondary mb-8 leading-relaxed">
                    The requested resource could not be found. It may have been moved, deleted, or never existed in this sector.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/dashboard"
                        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-background hover:bg-primary/90 transition-all transform hover:scale-105"
                    >
                        Return to Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="rounded-xl border border-card-border bg-transparent px-6 py-3 text-sm font-semibold text-secondary hover:text-foreground hover:bg-white/5 transition-all"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
