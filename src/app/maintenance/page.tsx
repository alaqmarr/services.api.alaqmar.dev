export default function MaintenancePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#fdfcf8] dark:bg-[#1c1917] p-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="flex justify-center">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#bc8a5f]/10 dark:bg-[#bc8a5f]/20 ring-1 ring-[#bc8a5f]/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#bc8a5f]"
                        >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="m10 13-2 2" />
                            <path d="m8 13 2 2" />
                            <path d="M14 13l2 2" />
                            <path d="M16 13l-2 2" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight text-[#2d2a26] dark:text-[#fdfcf8]">
                        Under Maintenance
                    </h1>
                    <p className="text-[#78716c] dark:text-[#a8a29e] leading-relaxed">
                        We are currently performing scheduled maintenance to improve our services.
                        Please check back shortly.
                    </p>
                </div>

                <div className="text-sm text-[#d4a373]">
                    Error Code: <span className="font-mono text-[#bc8a5f] bg-[#bc8a5f]/10 px-2 py-1 rounded">AUTH_004</span>
                </div>
            </div>
        </main>
    );
}
