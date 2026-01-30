"use client";

import {useState} from "react";

type Props = {
    token: string;
    onCreated: (data: any) => void;
};

export function CreateUrl({token, onCreated}: Props) {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [expire, setExpire] = useState("1h");
    const [isPublic, setIsPublic] = useState(false);

    const submit = async () => {
        if (!token) {
            alert("Create session first");
            return;
        }

        const res = await fetch("http://host.docker.internal:57000/api/urls", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
                alias: alias || undefined,
                expire,
                isPublic,
            }),
        });

        if (!res.ok) {
            alert("Failed to create URL");
            return;
        }

        const data = await res.json();
        onCreated(data);
    };

    return (
        <div className="flex flex-col gap-2 border p-4 rounded w-[420px]">
            <input
                className="border p-2 rounded"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <input
                className="border p-2 rounded"
                placeholder="Alias (optional)"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
            />

            <select
                className="border p-2 rounded"
                value={expire}
                onChange={(e) => setExpire(e.target.value)}
            >
                <option value="1h">1 hour</option>
                <option value="1d">1 day</option>
                <option value="1t">1 week</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />
                Public URL
            </label>

            <button
                onClick={submit}
                className="bg-blue-600 text-white py-2 rounded"
            >
                Create short URL
            </button>
        </div>
    );
}
