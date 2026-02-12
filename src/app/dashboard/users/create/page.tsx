import CreateUserForm from '@/app/ui/dashboard/create-user-form';
import Link from 'next/link';

export default function Page() {
    return (
        <main className="w-full max-w-2xl mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Add Admin User</h1>
                <Link
                    href="/dashboard"
                    className="text-sm text-gray-500 hover:text-gray-900"
                >
                    ← Back to Dashboard
                </Link>
            </div>
            <CreateUserForm />
        </main>
    );
}
