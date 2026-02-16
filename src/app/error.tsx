
'use client';

import { useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Using outline for consistency

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="rounded-3xl bg-card-bg border border-red-500/20 p-12 text-center max-w-lg w-full relative overflow-hidden">
                {/* Red Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                    <ExclamationCircleIcon className="h-10 w-10 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                    System Malfunction
                </h2>

                <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/5 text-left overflow-auto max-h-32">
                    <p className="text-xs font-mono text-red-400 break-all">
                        Error: {error.message || "An unexpected error occurred."}
                    </p>
                    {error.digest && (
                        <p className="text-[10px] font-mono text-secondary mt-2">
                            Digest: {error.digest}
                        </p>
                    )}
                </div>

                <p className="text-secondary mb-8 text-sm">
                    The system encountered an unrecoverable error. Diagnostics have been logged.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all transform hover:scale-105 active:scale-95"
                    >
                        Initialize Reboot
                    </button>
                </div>
            </div>
        </div>
    );
}
