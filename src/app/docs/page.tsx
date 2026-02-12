import Link from 'next/link';
import errorCodes from '../../../error_codes.json';

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-[#fdfcf8] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-[#d4a373] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-[#bc8a5f] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="mx-auto max-w-5xl relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#d4a373]/10 border border-[#d4a373]/20 text-[#bc8a5f] text-xs font-semibold tracking-wider uppercase mb-4">
                        Developer Resources
                    </span>
                    <h1 className="text-4xl font-bold tracking-tight text-[#2d2a26] sm:text-5xl font-sans">API Documentation</h1>
                    <p className="mt-4 text-lg text-[#78716c] max-w-2xl mx-auto">
                        Complete reference for the Alaqmar Services API. Integrate authentication, handle billing statuses, and manage access with ease.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Introduction & Auth */}
                    <section className="rounded-3xl bg-white p-8 shadow-sm border border-[#e5e5e5] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a373]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h2 className="text-2xl font-bold text-[#2d2a26] mb-4">Authentication</h2>
                        <p className="text-[#57534e] leading-relaxed mb-6">
                            The Alaqmar Services API uses API Keys to authenticate requests. You must include your API Key in the <code className="font-mono text-sm text-[#bc8a5f] bg-[#f5f5f4] px-1.5 py-0.5 rounded border border-[#e7e5e4]">x-api-key</code> header for all requests.
                        </p>
                        <div className="bg-[#1c1917] rounded-xl p-4 overflow-x-auto border border-[#2d2a26]">
                            <code className="text-[#e7e5e4] font-mono text-sm">
                                <span className="text-[#a8a29e]">// Example Request Header</span><br />
                                x-api-key: your_api_key_here
                            </code>
                        </div>
                    </section>

                    {/* Authorization Flow */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2d2a26] mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#bc8a5f]/10 text-[#bc8a5f] text-sm">01</span>
                            Authorization Flow
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <FlowCard
                                step="1"
                                title="Client Request"
                                description="User visits your application. Your middleware intercepts the request."
                            />
                            <FlowCard
                                step="2"
                                title="Verify Access"
                                description="Middleware calls GET /api/authorize with the Client ID or API Key."
                            />
                            <FlowCard
                                step="3"
                                title="Handle Response"
                                description="If 200 OK, proceed. If 403/503, redirect to error or maintenance pages."
                            />
                        </div>
                    </section>

                    {/* API Reference: Authorize */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2d2a26] mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#bc8a5f]/10 text-[#bc8a5f] text-sm">02</span>
                            Endpoint Reference
                        </h2>

                        <div className="rounded-3xl bg-white shadow-sm border border-[#e5e5e5] overflow-hidden">
                            <div className="border-b border-[#e5e5e5] bg-[#fdfcf8] px-6 py-4 flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-md bg-[#d4a373] text-white text-xs font-bold font-mono">GET</span>
                                <code className="text-sm font-mono text-[#57534e]">/api/authorize</code>
                            </div>

                            <div className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-sm font-bold text-[#2d2a26] uppercase tracking-wider mb-4">Query Parameters</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="border-b border-[#e5e5e5] text-[#a8a29e]">
                                                <tr>
                                                    <th className="font-medium pb-2">Parameter</th>
                                                    <th className="font-medium pb-2">Type</th>
                                                    <th className="font-medium pb-2">Required</th>
                                                    <th className="font-medium pb-2">Description</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f5f5f4] text-[#57534e]">
                                                <tr>
                                                    <td className="py-3 font-mono text-[#bc8a5f]">clientId</td>
                                                    <td className="py-3">string</td>
                                                    <td className="py-3">Yes*</td>
                                                    <td className="py-3">The public ID of the client application. *Required if x-api-key header is missing.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-[#2d2a26] uppercase tracking-wider mb-4">Response Type</h3>
                                    <div className="bg-[#1c1917] rounded-xl p-6 overflow-x-auto border border-[#2d2a26] shadow-inner">
                                        <pre className="text-[#e7e5e4] font-mono text-sm leading-relaxed">
                                            {`interface AuthorizeResponse {
  success: boolean;
  authorized: boolean;
  client?: {
    name: string;
    id: string;
  };
  code: string;       // e.g., "OK_001", "AUTH_004"
  message: string;    // Human-readable message
  redirectUrl?: string; // Present for maintenance/redirects
}`}
                                        </pre>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-[#ccd5ae] uppercase tracking-wider mb-2">Success Response (200)</h4>
                                        <div className="bg-[#f5f5f4] rounded-xl p-4 border border-[#e5e5e5]">
                                            <pre className="text-[#57534e] font-mono text-xs overflow-x-auto">
                                                {`{
  "success": true,
  "authorized": true,
  "client": {
    "name": "Acme Corp",
    "id": "cm..."
  },
  "code": "OK_001",
  "message": "Authorized successfully"
}`}
                                            </pre>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-[#bc8a5f] uppercase tracking-wider mb-2">Maintenance Response (503)</h4>
                                        <div className="bg-[#bc8a5f]/5 rounded-xl p-4 border border-[#bc8a5f]/20">
                                            <pre className="text-[#bc8a5f] font-mono text-xs overflow-x-auto">
                                                {`{
  "success": false,
  "authorized": false,
  "code": "AUTH_004",
  "message": "System under maintenance",
  "redirectUrl": "/maintenance"
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Error Codes Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-[#2d2a26] mb-6 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#bc8a5f]/10 text-[#bc8a5f] text-sm">03</span>
                            Error Reference
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {errorCodes.errors.map((error) => (
                                <Link
                                    key={error.code}
                                    href={`/docs/error/${error.code}`}
                                    className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-[#e5e5e5] transition-all hover:shadow-md hover:border-[#d4a373]/30 hover:-translate-y-1"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-x-4 mb-2">
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
                                        <p className="text-sm leading-6 text-[#78716c] line-clamp-2">
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
                    </section>
                </div>

                <div className="mt-16 text-center text-sm text-[#a8a29e]">
                    &copy; {new Date().getFullYear()} Alaqmar Services API Documentation
                </div>
            </div>
        </main>
    );
}

function FlowCard({ step, title, description }: { step: string; title: string; description: string }) {
    return (
        <div className="relative p-6 rounded-2xl bg-[#fdfcf8] border border-[#e5e5e5] shadow-sm flex flex-col items-start gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#d4a373] text-white text-sm font-bold shadow-sm shadow-[#d4a373]/20">
                {step}
            </span>
            <h3 className="text-base font-bold text-[#2d2a26]">{title}</h3>
            <p className="text-sm text-[#78716c] leading-snug">{description}</p>
        </div>
    );
}
