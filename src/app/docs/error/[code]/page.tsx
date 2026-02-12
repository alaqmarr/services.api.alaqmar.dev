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
        <main className="min-h-screen bg-[#fdfcf8] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 left-1/2 -ml-64 -mt-24 w-96 h-96 bg-[#d4a373] rounded-full mix-blend-multiply filter blur-3xl opacity-5 pointer-events-none"></div>

            <div className="w-full max-w-3xl relative z-10">
                <div className="mb-8">
                    <Link href="/docs" className="text-sm font-medium text-[#78716c] hover:text-[#d4a373] flex items-center gap-2 transition-colors">
                        ← Back to Documentation
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-[#d4a373]/5 border border-[#e5e5e5]">
                    <div className="border-b border-[#e5e5e5] bg-[#fdfcf8] px-8 py-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-sm text-[#a8a29e] bg-white px-2 py-1 rounded border border-[#e5e5e5]">Error Code: {error.code}</span>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${error.httpStatus >= 500 ? 'bg-red-50 text-red-700 ring-red-600/10' :
                                error.httpStatus >= 400 ? 'bg-[#bc8a5f]/10 text-[#bc8a5f] ring-[#bc8a5f]/20' :
                                    'bg-[#f5f5f4] text-[#57534e] ring-[#d6d3d1]/50'
                                }`}>
                                HTTP {error.httpStatus}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#2d2a26] font-sans">
                            {error.title}
                        </h1>
                    </div>

                    <div className="px-8 py-8">
                        <div className="prose prose-stone max-w-none">
                            <h3 className="text-lg font-bold text-[#2d2a26]">Description</h3>
                            <p className="text-[#57534e] leading-relaxed">
                                {error.description}
                            </p>

                            <div className="mt-8 rounded-2xl bg-[#fdfcf8] p-6 border border-[#d4a373]/20 shadow-sm">
                                <h3 className="text-xs font-bold text-[#bc8a5f] uppercase tracking-wider mb-2">Developer Message</h3>
                                <p className="font-mono text-sm text-[#78716c] break-all">
                                    {error.message}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-[#2d2a26]">How to Resolve</h3>
                                <ul className="list-disc pl-5 mt-2 space-y-2 text-[#57534e]">
                                    <li>{error.resolution}</li>
                                    <li>If the issue persists, check your network connection.</li>
                                    <li>Contact Alaqmar Services support with code: <strong className="text-[#2d2a26]">{code}</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-[#a8a29e]">
                    &copy; {new Date().getFullYear()} Alaqmar Services API Documentation
                </div>
            </div>
        </main>
    );
}
