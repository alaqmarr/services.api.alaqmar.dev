import errorCodes from '../../../../../error_codes.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Correct type for Next.js 15/16 App Router params
export async function generateStaticParams() {
    return errorCodes.errors.map((error) => ({
        code: error.code,
    }));
}

export default async function ErrorPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const error = errorCodes.errors.find((e) => e.code === code);

    if (!error) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-grid-pattern flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <div className="mb-8">
                    <Link href="/docs" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
                        ← Back to Documentation
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                    <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-gray-500">Error Code: {error.code}</span>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${error.httpStatus >= 500 ? 'bg-red-50 text-red-700 ring-red-600/10' :
                                error.httpStatus >= 400 ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                    'bg-gray-50 text-gray-600 ring-gray-500/10'
                                }`}>
                                HTTP {error.httpStatus}
                            </span>
                        </div>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                            {error.title}
                        </h1>
                    </div>

                    <div className="px-8 py-8">
                        <div className="prose prose-blue max-w-none">
                            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {error.description}
                            </p>

                            <div className="mt-8 rounded-lg bg-blue-50/50 p-6 border border-blue-100">
                                <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Developer Message</h3>
                                <p className="mt-2 font-mono text-sm text-blue-700">
                                    {error.message}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900">How to Resolve</h3>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                                    <li>{error.resolution}</li>
                                    {/* General troubleshooting steps could go here */}
                                    <li>If the issue persists, check your network connection.</li>
                                    <li>Contact Alaqmar Services support code: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{code}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Alaqmar Services API Documentation
                </div>
            </div>
        </main>
    );
}
