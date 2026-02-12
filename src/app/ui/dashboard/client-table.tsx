'use client';

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
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Domain
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Maintenance
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    API Key
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {clients?.map((client) => (
                                <tr
                                    key={client.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p>{client.name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {client.domain}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <Status status={client.billingStatus} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <form action={toggleMaintenance.bind(null, client.id, client.maintenanceMode)}>
                                            <button className={`rounded-md px-2 py-1 text-xs font-medium ${client.maintenanceMode ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                {client.maintenanceMode ? 'Maintenance ON' : 'Active'}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-gray-500">
                                        {client.apiKey}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <form action={deleteClient.bind(null, client.id)}>
                                                <button className="rounded-md border p-2 hover:bg-gray-100">
                                                    <span className="sr-only">Delete</span>
                                                    🗑️
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Status({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${status === 'PAID'
                    ? 'bg-green-500 text-white'
                    : status === 'UNPAID'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-red-500 text-white'
                }`}
        >
            {status}
        </span>
    );
}
