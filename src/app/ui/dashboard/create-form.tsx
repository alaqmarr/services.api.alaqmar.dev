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
            <div className="rounded-xl bg-[#fdfcf8] p-8 shadow-sm border border-[#ccd5ae] ring-1 ring-[#ccd5ae]/20">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#ccd5ae]/20 mb-4 ring-1 ring-[#ccd5ae]">
                        <svg className="h-8 w-8 text-[#2d2a26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#2d2a26]">Client Created!</h3>
                    <p className="mt-2 text-sm text-[#78716c] max-w-sm mx-auto">
                        The client has been successfully added to the database. Save these credentials now.
                        <span className="block text-[#bc8a5f] font-medium mt-1 text-xs uppercase tracking-wide">⚠️ Credentials shown only once</span>
                    </p>
                </div>

                <div className="space-y-6 bg-[#f5f5f4] p-6 rounded-lg border border-[#e5e5e5]">
                    <div>
                        <label className="block text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-1">Client Name</label>
                        <div className="text-base font-medium text-[#2d2a26]">{state.client.name}</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-1">API Key</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={state.client.apiKey}
                                className="flex-1 block w-full rounded-none rounded-l-md border-[#d6d3d1] bg-white p-2.5 text-sm text-[#2d2a26] font-mono focus:ring-[#d4a373] focus:border-[#d4a373]"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(state.client.apiKey); toast.success("Copied!"); }}
                                className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-[#d6d3d1] text-sm font-medium rounded-r-md text-[#57534e] bg-[#f5f5f4] hover:bg-[#e7e5e4] focus:outline-none focus:ring-1 focus:ring-[#d4a373] focus:border-[#d4a373] transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#a8a29e] uppercase tracking-wider mb-1">Auth URL</label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                readOnly
                                value={authUrl}
                                className="flex-1 block w-full rounded-none rounded-l-md border-[#d6d3d1] bg-white p-2.5 text-sm text-[#78716c] focus:ring-[#d4a373] focus:border-[#d4a373]"
                            />
                            <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(authUrl); toast.success("Copied!"); }}
                                className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-[#d6d3d1] text-sm font-medium rounded-r-md text-[#57534e] bg-[#f5f5f4] hover:bg-[#e7e5e4] focus:outline-none focus:ring-1 focus:ring-[#d4a373] focus:border-[#d4a373] transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#fdfcf8] bg-[#2d2a26] hover:bg-[#1c1917] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d2a26] transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form action={dispatch} className="bg-white rounded-xl shadow-sm border border-[#e5e5e5] p-8">
            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#44403c] mb-1">
                        Client Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        className="block w-full rounded-lg border-[#d6d3d1] shadow-sm focus:border-[#d4a373] focus:ring-[#d4a373] sm:text-sm py-2.5 px-3 uppercase tracking-tight"
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
                    <label htmlFor="domain" className="block text-sm font-medium text-[#44403c] mb-1">
                        Domain
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-[#a8a29e] sm:text-sm">https://</span>
                        </div>
                        <input
                            type="text"
                            name="domain"
                            id="domain"
                            className="block w-full rounded-lg border-[#d6d3d1] pl-16 focus:border-[#d4a373] focus:ring-[#d4a373] sm:text-sm py-2.5 pr-3"
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
                    <label className="block text-sm font-medium text-[#44403c] mb-3">Billing Status</label>
                    <div className="grid grid-cols-3 gap-3">
                        <LabelRadio
                            id="paid"
                            name="billingStatus"
                            value="PAID"
                            defaultChecked
                            label="Paid"
                            colorClass="peer-checked:border-[#ccd5ae] peer-checked:text-[#2d2a26] peer-checked:bg-[#ccd5ae]/20"
                        />
                        <LabelRadio
                            id="unpaid"
                            name="billingStatus"
                            value="UNPAID"
                            label="Unpaid"
                            colorClass="peer-checked:border-[#d6d3d1] peer-checked:text-[#44403c] peer-checked:bg-[#f5f5f4]"
                        />
                        <LabelRadio
                            id="overdue"
                            name="billingStatus"
                            value="OVERDUE"
                            label="Overdue"
                            colorClass="peer-checked:border-[#bc8a5f] peer-checked:text-[#bc8a5f] peer-checked:bg-[#bc8a5f]/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Plan Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[#44403c] mb-3">Subscription Plan</label>
                        <select
                            name="plan"
                            className="block w-full rounded-lg border-[#d6d3d1] shadow-sm focus:border-[#d4a373] focus:ring-[#d4a373] sm:text-sm py-2.5 px-3"
                        >
                            <option value="Basic">Basic Plan</option>
                            <option value="Standard">Standard Plan</option>
                            <option value="Pro">Pro Plan</option>
                            <option value="Enterprise">Enterprise</option>
                        </select>
                    </div>

                    {/* Billing Cycle */}
                    <div>
                        <label className="block text-sm font-medium text-[#44403c] mb-3">Billing Cycle</label>
                        <div className="flex gap-4 items-start">
                            <div className="w-24 flex-shrink-0">
                                <label className="sr-only" htmlFor="period">Duration</label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        name="billingPeriod"
                                        id="period"
                                        min="1"
                                        defaultValue="1"
                                        className="block w-full rounded-lg border-[#d6d3d1] focus:border-[#d4a373] focus:ring-[#d4a373] sm:text-sm py-3 px-3 text-center font-semibold"
                                        placeholder="1"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none">
                                        <span className="text-gray-400 text-xs mr-1">x</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow grid grid-cols-4 gap-2">
                                <LabelRadio
                                    id="daily"
                                    name="billingCycle"
                                    value="DAILY"
                                    label="Daily"
                                    colorClass="peer-checked:border-[#e6ccb2] peer-checked:text-[#2d2a26] peer-checked:bg-[#e6ccb2]/20"
                                />
                                <LabelRadio
                                    id="weekly"
                                    name="billingCycle"
                                    value="WEEKLY"
                                    label="Weekly"
                                    colorClass="peer-checked:border-[#d4a373] peer-checked:text-[#a16207] peer-checked:bg-[#d4a373]/10"
                                />
                                <LabelRadio
                                    id="monthly"
                                    name="billingCycle"
                                    value="MONTHLY"
                                    defaultChecked
                                    label="Monthly"
                                    colorClass="peer-checked:border-[#d4a373] peer-checked:text-[#2d2a26] peer-checked:bg-[#d4a373]/20"
                                />
                                <LabelRadio
                                    id="yearly"
                                    name="billingCycle"
                                    value="YEARLY"
                                    label="Yearly"
                                    colorClass="peer-checked:border-[#1c1917] peer-checked:text-[#1c1917] peer-checked:bg-[#1c1917]/5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="md:col-span-2">
                        <label htmlFor="startDate" className="block text-sm font-medium text-[#44403c] mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="block w-full rounded-lg border-[#d6d3d1] shadow-sm focus:border-[#d4a373] focus:ring-[#d4a373] sm:text-sm py-2.5 px-3"
                        />
                        <p className="mt-1 text-xs text-[#a8a29e]">Defaults to today if left blank.</p>
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
                    className="text-sm font-semibold leading-6 text-[#44403c] hover:text-[#2d2a26]"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="rounded-lg bg-[#2d2a26] px-4 py-2.5 text-sm font-semibold text-[#fdfcf8] shadow-sm hover:bg-[#1c1917] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2d2a26] transition-all"
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
                className={`flex items-center justify-center rounded-lg border border-[#d6d3d1] bg-white px-3 py-3 text-sm font-medium text-[#44403c] hover:bg-[#f5f5f4] hover:text-[#2d2a26] peer-focus:ring-2 peer-focus:ring-[#d4a373] peer-focus:ring-offset-2 cursor-pointer transition-all ${colorClass}`}
            >
                {label}
            </label>
        </div>
    )
}
