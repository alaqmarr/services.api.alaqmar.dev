'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <form action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-6 pb-4 pt-8 text-[#e6ccb2]">
                <h1 className="mb-3 text-2xl font-bold text-[#fdfcf8]">
                    Please log in to continue.
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-2 mt-5 block text-xs font-medium text-[#a8a29e] uppercase tracking-wider"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-xl border border-white/10 bg-black/20 py-[10px] pl-4 text-sm outline-none text-[#fdfcf8] placeholder:text-[#78716c] focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-2 mt-5 block text-xs font-medium text-[#a8a29e] uppercase tracking-wider"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-xl border border-white/10 bg-black/20 py-[10px] pl-4 text-sm outline-none text-[#fdfcf8] placeholder:text-[#78716c] focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <LoginButton />
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-sm text-[#bc8a5f]">{errorMessage}</p>
                    )}
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#d4a373] to-[#bc8a5f] px-4 py-3 text-sm font-bold text-[#1c1917] shadow-lg shadow-[#d4a373]/20 transition-all hover:scale-[1.02] hover:shadow-[#d4a373]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a373] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            aria-disabled={pending}
        >
            {pending ? 'Logging in...' : 'Log in'}
        </button>
    );
}
