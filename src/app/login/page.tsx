import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen text-[#2d2a26] bg-[#fdfcf8]">
            {/* Decorative Side */}
            <div className="hidden w-1/2 bg-[#1c1917] lg:flex items-center justify-center relative overflow-hidden">
                {/* Abstract shapes / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d2a26] to-[#1c1917] opacity-90"></div>

                {/* Gold Glow */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4a373] rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>

                {/* Sand Glow */}
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#e6ccb2] rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 p-12 text-[#fdfcf8]">
                    <h1 className="text-5xl font-bold mb-6 font-sans tracking-tight">Alaqmar Services</h1>
                    <p className="text-xl text-[#e6ccb2] max-w-md leading-relaxed font-light opacity-90">
                        Manage your client integrations, billing, and maintenance modes from one curated workspace.
                    </p>
                </div>
            </div>

            {/* Login Form Side */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12 relative">
                {/* Subtle Grain or Gradient for form side */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-0"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mb-10">
                            <h1 className="text-3xl font-bold text-[#d4a373]">Alaqmar Services</h1>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#2d2a26]">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-[#8a8a8a]">
                            Enter your credentials to access the workspace.
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
