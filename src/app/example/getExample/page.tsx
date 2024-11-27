"use client";

import { useEffect, useState } from "react";

interface Role {
    id: number;
    name: string;
    rank_id: string;
}

export default function RolesTable() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/roles",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch roles");
                }

                const data: Role[] = await response.json();
                setRoles(data);
                console.log(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Roles List</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left">
                                ID
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                                Name
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                                Rank ID
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">
                                    {role.id}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {role.name}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {role.rank_id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
