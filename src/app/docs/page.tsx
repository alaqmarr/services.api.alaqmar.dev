import Link from 'next/link';
import errorCodes from '../../../error_codes.json';

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#fdfcf8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-[#d4a373] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-[#bc8a5f] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#d4a373]/10 border border-[#d4a373]/20 text-[#bc8a5f] text-xs font-semibold tracking-wider uppercase mb-4">
                        Developer Resources
                    </span>
                    <h1 className="text-4xl font-bold tracking-tight text-[#2d2a26] sm:text-5xl font-sans">API Documentation</h1>
                    <p className="mt-4 text-lg text-[#78716c]">
                        Comprehensive guide to Alaqmar Services API error codes and integrations.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Intro Card */}
                    <div className="col-span-full rounded-3xl bg-white p-8 shadow-sm border border-[#e5e5e5] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a373]/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <h2 className="text-xl font-bold leading-8 text-[#2d2a26]">Getting Started</h2>
                        <p className="mt-2 text-sm leading-6 text-[#78716c]">
                            To authenticate with our API, you must include the <code className="rounded bg-[#f5f5f4] px-1.5 py-0.5 font-mono text-[#bc8a5f] font-medium border border-[#e7e5e4]">x-api-key</code> header in all your requests.
                            You can obtain this key from your dashboard.
                        </p>
                    </div>

                    {/* Error Codes Section */}
                    <div className="col-span-full mt-8">
                        <h2 className="text-2xl font-bold text-[#2d2a26] mb-6">Error Reference</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {errorCodes.errors.map((error) => (
                                <Link
                                    key={error.code}
                                    href={`/docs/error/${error.code}`}
                                    className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-[#e5e5e5] transition-all hover:shadow-md hover:border-[#d4a373]/30 hover:-translate-y-1"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-x-4">
                                            <h3 className="text-sm font-bold leading-6 text-[#2d2a26] group-hover:text-[#d4a373] transition-colors">
                                                {error.title}
                                            </h3>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${error.httpStatus >= 500 ? 'bg-red-50 text-red-700 ring-red-600/10' :
                                                error.httpStatus >= 400 ? 'bg-[#bc8a5f]/10 text-[#bc8a5f] ring-[#bc8a5f]/20' :
                                                    'bg-[#f5f5f4] text-[#57534e] ring-[#d6d3d1]/50'
                                                }`}>
                                                {error.httpStatus}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-[#78716c] line-clamp-2">
                                            {error.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-x-1 text-xs font-medium text-[#a8a29e]">
                                        <code className="text-xs text-[#d6d3d1]">{error.code}</code>
                                        <span aria-hidden="true" className="ml-auto text-[#d4a373] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
