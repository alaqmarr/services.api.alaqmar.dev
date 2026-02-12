import Link from 'next/link';
import errorCodes from '../../../error_codes.json';

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
            <div className="mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">API Documentation</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Comprehensive guide to Alaqmar Services API error codes and integrations.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Intro Card */}
                    <div className="col-span-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
                        <h2 className="text-lg font-semibold leading-8 text-gray-900">Getting Started</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                            To authenticate with our API, you must include the <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-gray-900">x-api-key</code> header in all your requests.
                            You can obtain this key from your dashboard.
                        </p>
                    </div>

                    {/* Error Codes Section */}
                    <div className="col-span-full mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Reference</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {errorCodes.errors.map((error) => (
                                <Link
                                    key={error.code}
                                    href={`/docs/error/${error.code}`}
                                    className="group relative flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:ring-blue-500/50"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-x-4">
                                            <h3 className="text-sm font-semibold leading-6 text-gray-900 group-hover:text-blue-600">
                                                {error.title}
                                            </h3>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${error.httpStatus >= 500 ? 'bg-red-50 text-red-700 ring-red-600/10' :
                                                    error.httpStatus >= 400 ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                        'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                }`}>
                                                {error.httpStatus}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-gray-500 line-clamp-2">
                                            {error.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-x-1 text-xs font-medium text-gray-500">
                                        <code className="text-xs text-gray-400">{error.code}</code>
                                        <span aria-hidden="true" className="ml-auto text-gray-400 group-hover:text-blue-500">→</span>
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
