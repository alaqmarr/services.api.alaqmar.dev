'use client';

import { createUser, State } from '@/lib/actions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreateUserForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createUser, initialState);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            toast.success("User created successfully!");
        }
    }, [state]);

    if (showSuccess) {
        return (
            <div className="rounded-3xl bg-card-bg p-8 shadow-sm border border-card-border text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 mb-4 ring-1 ring-primary/50">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">User Created!</h3>
                <p className="mt-2 text-sm text-secondary">
                    The new admin user has been successfully added. They can now log in to the dashboard.
                </p>
                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-background shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all transform hover:scale-105"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form action={dispatch} className="bg-card-bg rounded-3xl shadow-sm border border-card-border p-8">
            <div className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="block w-full rounded-xl border-card-border bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 transition-all text-foreground placeholder-secondary"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="block w-full rounded-xl border-card-border bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 transition-all text-foreground placeholder-secondary"
                        required
                    />
                    <div aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-primary">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full rounded-xl border-card-border bg-background shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 transition-all text-foreground placeholder-secondary"
                        required
                        minLength={6}
                    />
                    <div aria-live="polite" aria-atomic="true">
                        {state.errors?.password &&
                            state.errors.password.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-primary">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="text-sm text-primary bg-primary/10 p-3 rounded-xl border border-primary/20">{state.message}</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-x-4">
                <Link
                    href="/dashboard"
                    className="text-sm font-semibold leading-6 text-secondary hover:text-foreground"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm hover:bg-black dark:hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-all transform hover:scale-105"
                >
                    Create User
                </button>
            </div>
        </form>
    );
}
