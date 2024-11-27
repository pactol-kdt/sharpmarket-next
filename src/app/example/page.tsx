"use client";

import { useState } from "react";

interface RoleFormData {
    name: string;
    rank_id: string;
}

export default function NewRoleForm() {
    const [formData, setFormData] = useState<RoleFormData>({
        name: "",
        rank_id: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Step 1: Fetch CSRF cookie
            await fetch("http://127.0.0.1:8000/api/roles", {
                credentials: "include", // Send cookies with the request
            });

            // Step 2: Submit the form data
            const response = await fetch("http://127.0.0.1:8000/api/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getXsrfTokenFromCookie() ?? "", // Include XSRF token
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || "Something went wrong.");
                return;
            }

            setSuccess("Role created successfully!");
            setFormData({ name: "", rank_id: "" }); // Reset form
        } catch (err) {
            setError("Failed to submit the form. Please try again.");
        }
    };

    // Utility function to extract XSRF token from cookies
    const getXsrfTokenFromCookie = (): string | null => {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Create New Role</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="rank_id" className="block font-medium mb-1">
                        Rank ID
                    </label>
                    <input
                        type="text"
                        id="rank_id"
                        name="rank_id"
                        value={formData.rank_id}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
