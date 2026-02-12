export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
            <div className="relative flex flex-col items-center">
                {/* Techy Spinner */}
                <div className="relative h-24 w-24">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-zinc-800"></div>
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg dark:border-indigo-500"></div>

                    {/* Inner Pulsing Core */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-4 w-4 animate-ping rounded-full bg-blue-500 opacity-75"></div>
                    </div>
                </div>

                {/* Text */}
                <div className="mt-8 animate-pulse text-center">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Alaqmar Services</h2>
                    <p className="mt-1 text-xs uppercase tracking-widest text-blue-600 dark:text-indigo-400">Initializing System</p>
                </div>
            </div>
        </div>
    );
}
