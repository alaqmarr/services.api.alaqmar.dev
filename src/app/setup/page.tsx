import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SetupForm from '@/app/ui/setup-form';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
        redirect('/login');
    }

    return (
        <main className="flex min-h-screen text-gray-900 bg-white">
            {/* Decorative Side */}
            <div className="hidden w-1/2 bg-zinc-900 lg:flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-zinc-900 opacity-90"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 p-12 text-white">
                    <h1 className="text-4xl font-bold mb-6 font-sans tracking-tight">System Initialization</h1>
                    <p className="text-lg text-zinc-300 max-w-md leading-relaxed">
                        Welcome to Alaqmar Services. Let's get your admin account set up to start managing your ecosystem.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mb-10">
                            <h1 className="text-3xl font-bold text-indigo-600">Alaqmar Services</h1>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Create Admin Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            This will be the super-user for your dashboard.
                        </p>
                    </div>

                    <SetupForm />
                </div>
            </div>
        </main>
    );
}
