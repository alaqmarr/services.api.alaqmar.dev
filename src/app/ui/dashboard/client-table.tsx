'use client';

import toast from 'react-hot-toast';
import { deleteClient, toggleMaintenance } from '@/lib/actions';

export default function ClientTable({
    clients,
}: {
    clients: Array<{
        id: string;
        name: string;
        domain: string;
        billingStatus: 'PAID' | 'UNPAID' | 'OVERDUE';
        maintenanceMode: boolean;
        apiKey: string;
    }>;
}) {
    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text);
        toast.success(message);
    };

    if (!clients || clients.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4 bg-gray-50 rounded-full flex items-center justify-center text-xl">📂</div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No clients</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new client.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {clients?.map((client) => (
                    <div key={client.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {getInitials(client.name)}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                                    <p className="text-xs text-gray-500">{client.domain}</p>
                                </div>
                            </div>
                            <Status status={client.billingStatus} />
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Maintenance</span>
                                <MaintenanceToggle client={client} />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">API Access</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(client.apiKey, 'API Key Copied!')}
                                        className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200"
                                    >
                                        Copy Key
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(`${window.location.origin}/api/authorize?clientId=${client.id}`, 'Link Copied!')}
                                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-100"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <DeleteButton id={client.id} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View (Table) */}
            <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th scope="col" className="px-6 py-4">Client</th>
                        <th scope="col" className="px-6 py-4">Status</th>
                        <th scope="col" className="px-6 py-4">Maintenance</th>
                        <th scope="col" className="px-6 py-4">Credentials</th>
                        <th scope="col" className="relative px-6 py-4">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {clients?.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {getInitials(client.name)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{client.name}</div>
                                        <div className="text-sm text-gray-500">{client.domain}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Status status={client.billingStatus} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <MaintenanceToggle client={client} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyToClipboard(client.apiKey, 'API Key Copied!')}
                                        className="group flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                                        title="Copy API Key"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500">
                                            <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5V7A2.5 2.5 0 0 0 11 4.5H8.128a2.252 2.252 0 0 1 1.884-1.488A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M2 7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm2 3.25a.25.25 0 0 1 .25-.25h4.5a.25.25 0 0 1 .25.25v2.5a.25.25 0 0 1-.25.25h-4.5a.25.25 0 0 1-.25-.25v-2.5Z" clipRule="evenodd" />
                                        </svg>
                                        Copy Key
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(`${window.location.origin}/api/authorize?clientId=${client.id}`, 'Auth URL Copied!')}
                                        className="group flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                                            <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
                                        </svg>
                                        Copy Link
                                    </button>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DeleteButton id={client.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Status({ status }: { status: string }) {
    const styles = {
        PAID: 'bg-green-50 text-green-700 ring-green-600/20',
        UNPAID: 'bg-gray-50 text-gray-600 ring-gray-500/10',
        OVERDUE: 'bg-red-50 text-red-700 ring-red-600/10'
    };
    const dotStyles = {
        PAID: 'bg-green-600',
        UNPAID: 'bg-gray-500',
        OVERDUE: 'bg-red-600'
    };

    const key = status as keyof typeof styles;

    return (
        <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[key]}`}>
            <svg className={`h-1.5 w-1.5 fill-current ${dotStyles[key]}`} viewBox="0 0 6 6" aria-hidden="true">
                <circle cx={3} cy={3} r={3} />
            </svg>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

function MaintenanceToggle({ client }: { client: any }) {
    return (
        <form action={toggleMaintenance.bind(null, client.id, client.maintenanceMode)}>
            <button
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${client.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                role="switch"
                aria-checked={client.maintenanceMode}
                title={client.maintenanceMode ? 'Turn Maintenance Off' : 'Turn Maintenance On'}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${client.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </form>
    )
}

function DeleteButton({ id }: { id: string }) {
    return (
        <form action={deleteClient.bind(null, id)}>
            <button className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50" title="Delete Client">
                <span className="sr-only">Delete</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                </svg>
            </button>
        </form>
    )
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
