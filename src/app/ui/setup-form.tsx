'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { setupAdmin, State } from '@/lib/actions';

export default function SetupForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(setupAdmin, initialState);

    return (
        <form action={dispatch} className="space-y-4">
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium text-gray-900"
                >
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Admin Name"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 text-black"
                />
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-gray-900"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 text-black"
                    required
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email &&
                        //@ts-ignore
                        state.errors.email.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* Password */}
            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-gray-900"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 text-black"
                    required
                    minLength={6}
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password &&
                        //@ts-ignore
                        state.errors.password.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            <div aria-live="polite" aria-atomic="true">
                {state.message && (
                    <p className="text-sm text-red-500">{state.message}</p>
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
            className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            type="submit"
            aria-disabled={pending}
        >
            {pending ? 'Creating...' : 'Create Admin Account'}
        </button>
    );
}
