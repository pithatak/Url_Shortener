"use client";

import { useEffect, useState } from "react";

type UrlItem = {
    id: number;
    originalUrl: string;
    shortCode: string;
    expiresAt?: string;
    isPublic?: boolean;
};

type Props = {
    token: string;
};

export function UrlsPanel({ token }: Props) {
    const [mode, setMode] = useState<"public" | "private">("public");
    const [urls, setUrls] = useState<UrlItem[]>([]);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                if (mode === "public") {
                    const res = await fetch("http://host.docker.internal:57000/api/public");
                    const data = await res.json();
                    setUrls(data);
                } else if (mode === "private" && token) {
                    const res = await fetch("http://host.docker.internal:57000/api/urls", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    setUrls(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUrls();
    }, [mode, token]);

    const showStats = async (url: UrlItem) => {
        try {
            const headers: any = {};
            if (!url.isPublic && token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(
                `http://host.docker.internal:57000/api/urls/${url.id}/stats`, {
                headers: { Authorization: `Bearer ${token}` },
                method: 'GET'
            });

            if (res.status === 404) {
                return alert("Stats not available for this URL");
            }
            if (!res.ok) return alert("Cannot get stats");

            const data = await res.json();
            alert(
                `ID: ${data.id}\nClicks: ${data.clicks}\nCreated: ${data.createdAt}\nExpires: ${data.expiresAt ?? "—"}`
            );
        } catch (err) {
            console.error(err);
        }
    };


    const deleteUrl = async (url: UrlItem) => {
        if (!token) return alert("Authorization required");
        try {
            const res = await fetch(`http://host.docker.internal:57000/api/urls/${url.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                method: 'DELETE'
            });
            if (!res.ok) return alert("Failed to delete");
            setUrls(urls.filter(u => u.id !== url.id));
            alert("Deleted");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-1/3">
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setMode("public")}
                    className={`px-3 py-1 border rounded ${mode === "public" ? "bg-blue-600 text-white" : ""}`}
                >
                    Public URLs
                </button>
                <button
                    onClick={() => setMode("private")}
                    disabled={!token}
                    className={`px-3 py-1 border rounded ${mode === "private" ? "bg-blue-600 text-white" : ""} disabled:opacity-50`}
                >
                    Your URLs
                </button>
            </div>
            <table className="w-full border text-sm">
                <thead>
                <tr className="border-b">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Original URL</th>
                    <th className="p-2 text-left">ShortCode</th>
                    <th className="p-2 text-left">Expires At</th>
                    <th className="p-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {urls.map(u => (
                    <tr key={u.id} className="border-b">
                        <td className="p-2">{u.id}</td>
                        <td className="p-2 truncate">{u.originalUrl}</td>
                        <td className="p-2">
                            <a href={`http://host.docker.internal:57000/${u.shortCode}`} target="_blank" className="text-blue-600 underline">
                                {u.shortCode}
                            </a>
                        </td>
                        <td className="p-2">{u.expiresAt || "—"}</td>
                        <td className="p-2 flex gap-2">
                            <button
                                onClick={() => showStats(u)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                                Show stats
                            </button>
                            {mode === "private" && (
                                <button
                                    onClick={() => deleteUrl(u)}
                                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                    Delete
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
