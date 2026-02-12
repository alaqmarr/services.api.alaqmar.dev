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
            <div className="rounded-md bg-white p-6 shadow-md border border-green-200">
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Client Created Successfully!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Please copy the API Key and Authorization URL below.
                        <strong className="block text-red-500 mt-1">The API Key will only be shown once.</strong>
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Client Name</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-900">{state.client.name}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">API Key</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={state.client.apiKey}
                                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 font-mono focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(state.client.apiKey); toast.success("Copied!"); }}
                                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Authorization URL</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={authUrl}
                                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 bg-gray-50 p-2 text-sm text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(authUrl); toast.success("Copied!"); }}
                                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 text-black">
                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Client Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter client name"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                                required
                            />
                        </div>
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Domain */}
                <div className="mb-4">
                    <label htmlFor="domain" className="mb-2 block text-sm font-medium">
                        Domain
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="domain"
                                name="domain"
                                type="text"
                                placeholder="example.com"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="domain-error"
                                required
                            />
                        </div>
                    </div>
                    <div id="domain-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.domain &&
                            state.errors.domain.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Billing Status */}
                <fieldset className="mb-4">
                    <legend className="mb-2 block text-sm font-medium">
                        Billing Status
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    id="paid"
                                    name="billingStatus"
                                    type="radio"
                                    value="PAID"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                    defaultChecked
                                />
                                <label
                                    htmlFor="paid"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    Paid
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="unpaid"
                                    name="billingStatus"
                                    type="radio"
                                    value="UNPAID"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="unpaid"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                                >
                                    Unpaid
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="overdue"
                                    name="billingStatus"
                                    type="radio"
                                    value="OVERDUE"
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="overdue"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    Overdue
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <div aria-live="polite" aria-atomic="true">
                    {state.message && (
                        <p className="mt-2 text-sm text-red-500">{state.message}</p>
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Create Client
                </button>
            </div>
        </form>
    );
}
