import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="grid min-h-screen place-items-center bg-[#fdfcf8] px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4a373] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"></div>

            <div className="text-center relative z-10">
                <p className="text-base font-bold text-[#bc8a5f]">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#2d2a26] sm:text-5xl font-sans">Page not found</h1>
                <p className="mt-6 text-base leading-7 text-[#78716c]">
                    Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className="rounded-xl bg-[#1c1917] px-5 py-3 text-sm font-semibold text-[#fdfcf8] shadow-sm hover:bg-[#2d2a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1917] transition-all hover:scale-105"
                    >
                        Go back home
                    </Link>
                    <Link href="/docs" className="text-sm font-semibold text-[#2d2a26] hover:text-[#d4a373] transition-colors">
                        View Documentation <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
