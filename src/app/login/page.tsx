import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen text-gray-900 bg-white">
            {/* Decorative Side */}
            <div className="hidden w-1/2 bg-zinc-900 lg:flex items-center justify-center relative overflow-hidden">
                {/* Abstract shapes / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-zinc-900 opacity-90"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 p-12 text-white">
                    <h1 className="text-5xl font-bold mb-6 font-sans tracking-tight">Alaqmar Services</h1>
                    <p className="text-xl text-zinc-300 max-w-md leading-relaxed">
                        Manage your client integrations, billing, and maintenance modes from one powerful dashboard.
                    </p>
                </div>
            </div>

            {/* Login Form Side */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mb-10">
                            <h1 className="text-3xl font-bold text-blue-600">Alaqmar Services</h1>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your credentials to access the admin panel.
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
