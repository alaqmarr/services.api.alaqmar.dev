
'use client';

// Global Error must define its own <html> and <body> tags
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Using outline for consistency

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center bg-[#1c1917] text-[#e7e5e4] p-4 font-sans">
                <div className="rounded-3xl bg-[#292524] border border-red-500/20 p-12 text-center max-w-lg w-full relative overflow-hidden">

                    {/* Red Glow Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 mb-6 ring-1 ring-red-500/20">
                        <ExclamationCircleIcon className="h-10 w-10 text-red-500" />
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">
                        Critical Failure
                    </h2>

                    <div className="bg-black/20 rounded-xl p-4 mb-6 border border-white/5 text-left overflow-auto max-h-32 w-full">
                        <p className="text-xs font-mono text-red-400 break-all">
                            {error.message || "Unknown system failure."}
                        </p>
                        {error.digest && (
                            <p className="text-[10px] font-mono text-[#a8a29e] mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>

                    <p className="text-[#a8a29e] mb-8 leading-relaxed text-sm">
                        A catastrophic error occurred in the root layout. The application core has been compromised.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all transform hover:scale-105 active:scale-95"
                    >
                        System Reset
                    </button>
                </div>
            </body>
        </html>
    );
}
