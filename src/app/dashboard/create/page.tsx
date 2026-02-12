import CreateForm from '@/app/ui/dashboard/create-form';
import Link from 'next/link';

export default function Page() {
    return (
        <main className="w-full max-w-2xl mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#2d2a26] dark:text-[#fdfcf8]">Create New Client</h1>
                <Link
                    href="/dashboard"
                    className="text-sm text-[#78716c] hover:text-[#d4a373] transition-colors"
                >
                    ← Back to Clients
                </Link>
            </div>
            <CreateForm />
        </main>
    );
}
