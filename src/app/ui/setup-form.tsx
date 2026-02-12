'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { setupAdmin, State } from '@/lib/actions';

export default function SetupForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(setupAdmin, initialState);

    return (
        <form action={dispatch} className="space-y-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8">
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium text-[#a8a29e] uppercase tracking-wider"
                >
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Admin Name"
                    className="peer block w-full rounded-xl border border-white/10 bg-black/20 py-[10px] pl-4 text-sm outline-none text-[#fdfcf8] placeholder:text-[#78716c] focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                />
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-[#a8a29e] uppercase tracking-wider"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="peer block w-full rounded-xl border border-white/10 bg-black/20 py-[10px] pl-4 text-sm outline-none text-[#fdfcf8] placeholder:text-[#78716c] focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                    required
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email &&
                        //@ts-ignore
                        state.errors.email.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-[#bc8a5f]">
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* Password */}
            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-[#a8a29e] uppercase tracking-wider"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="peer block w-full rounded-xl border border-white/10 bg-black/20 py-[10px] pl-4 text-sm outline-none text-[#fdfcf8] placeholder:text-[#78716c] focus:border-[#d4a373]/50 focus:ring-1 focus:ring-[#d4a373]/50 transition-all"
                    required
                    minLength={6}
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password &&
                        //@ts-ignore
                        state.errors.password.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-[#bc8a5f]">
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <div aria-live="polite" aria-atomic="true">
                {state.message && (
                    <p className="text-sm text-[#bc8a5f]">{state.message}</p>
                )}
            </div>

            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#d4a373] to-[#bc8a5f] px-4 py-3 text-sm font-bold text-[#1c1917] shadow-lg shadow-[#d4a373]/20 transition-all hover:scale-[1.02] hover:shadow-[#d4a373]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a373] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            type="submit"
            aria-disabled={pending}
        >
            {pending ? 'Creating...' : 'Create Admin Account'}
        </button>
    );
}
