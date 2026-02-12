export default function MaintenancePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="flex justify-center">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
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
                            className="text-orange-600 dark:text-orange-500"
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

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Under Maintenance
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        We are currently performing scheduled maintenance to improve our services.
                        Please check back shortly.
                    </p>
                </div>

                <div className="text-sm text-zinc-400">
                    Error Code: <span className="font-mono text-zinc-600 dark:text-zinc-300">AUTH_004</span>
                </div>
            </div>
        </main>
    );
}
