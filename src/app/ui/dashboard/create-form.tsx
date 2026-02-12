'use client';

import { createClient, State } from '@/lib/actions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function CreateForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createClient, initialState);

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state?.success && state.client) {
            setShowSuccess(true);
            toast.success("Client created successfully!");
        }
    }, [state]);

    if (showSuccess && state.client) {
        const authUrl = `${window.location.origin}/api/authorize?clientId=${state.client.id}`;
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-green-100 ring-1 ring-green-500/10">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4 ring-1 ring-green-100">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Client Created!</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                        The client has been successfully added to the database. Save these credentials now.
                        <span className="block text-red-600 font-medium mt-1 text-xs uppercase tracking-wide">⚠️ Credentials shown only once</span>
                    </p>
                </div>

                <div className="space-y-6 bg-gray-50/50 p-6 rounded-lg border border-gray-100">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Client Name</label>
                        <div className="text-base font-medium text-gray-900">{state.client.name}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">API Key</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={state.client.apiKey}
                                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 bg-white p-2.5 text-sm text-gray-900 font-mono focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(state.client.apiKey); toast.success("Copied!"); }}
                                className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Auth URL</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={authUrl}
                                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 bg-white p-2.5 text-sm text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(authUrl); toast.success("Copied!"); }}
                                className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form action={dispatch} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Client Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 px-3"
                        aria-describedby="name-error"
                        required
                    />
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Domain */}
                <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                        Domain
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">https://</span>
                        </div>
                        <input
                            type="text"
                            name="domain"
                            id="domain"
                            className="block w-full rounded-lg border-gray-300 pl-16 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 pr-3"
                            placeholder="www.example.com"
                            aria-describedby="domain-error"
                            required
                        />
                    </div>
                    <div id="domain-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.domain &&
                            state.errors.domain.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-600">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Billing Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Billing Status</label>
                    <div className="grid grid-cols-3 gap-3">
                        <LabelRadio
                            id="paid"
                            name="billingStatus"
                            value="PAID"
                            defaultChecked
                            label="Paid"
                            colorClass="peer-checked:border-green-500 peer-checked:text-green-600 peer-checked:bg-green-50"
                        />
                        <LabelRadio
                            id="unpaid"
                            name="billingStatus"
                            value="UNPAID"
                            label="Unpaid"
                            colorClass="peer-checked:border-gray-500 peer-checked:text-gray-900 peer-checked:bg-gray-50"
                        />
                        <LabelRadio
                            id="overdue"
                            name="billingStatus"
                            value="OVERDUE"
                            label="Overdue"
                            colorClass="peer-checked:border-red-500 peer-checked:text-red-600 peer-checked:bg-red-50"
                        />
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{state.message}</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-x-4">
                <Link
                    href="/dashboard"
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
                >
                    Create Client
                </button>
            </div>
        </form>
    );
}

function LabelRadio({ id, name, value, label, defaultChecked, colorClass }: any) {
    return (
        <div>
            <input
                type="radio"
                name={name}
                id={id}
                value={value}
                className="peer sr-only"
                defaultChecked={defaultChecked}
            />
            <label
                htmlFor={id}
                className={`flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 cursor-pointer transition-all ${colorClass}`}
            >
                {label}
            </label>
        </div>
    )
}
