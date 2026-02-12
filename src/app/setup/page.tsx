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
        <main className="flex min-h-screen text-[#2d2a26] bg-[#fdfcf8]">
            {/* Decorative Side */}
            <div className="hidden w-1/2 bg-[#1c1917] lg:flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d2a26] to-[#1c1917] opacity-90"></div>

                {/* Gold Glow */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#d4a373] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>

                {/* Sand Glow */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#e6ccb2] rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 p-12 text-[#fdfcf8]">
                    <h1 className="text-4xl font-bold mb-6 font-sans tracking-tight">System Initialization</h1>
                    <p className="text-lg text-[#e6ccb2] max-w-md leading-relaxed font-light opacity-90">
                        Welcome to Alaqmar Services. Let's get your workspace ready.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12 relative">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-0"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mb-10">
                            <h1 className="text-3xl font-bold text-[#d4a373]">Alaqmar Services</h1>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#2d2a26]">
                            Create Admin Account
                        </h2>
                        <p className="mt-2 text-sm text-[#8a8a8a]">
                            This will be the super-user for your dashboard.
                        </p>
                    </div>

                    <SetupForm />
                </div>
            </div>
        </main>
    );
}
