"use client";

import { useEffect, useState } from "react";
import { CreateSession } from "@/components/CreateSession";
import { GetSession } from "@/components/GetSession";
import { CreateUrl } from "@/components/CreateUrl";
import { SessionInfo } from "@/components/SessionInfo";
import {UrlsPanel} from "@/components/UrlsPanel";
import {StatsPanel} from "@/components/StatsPanel";

export default function Page() {
    const [token, setToken] = useState("");
    const [session, setSession] = useState<any>(null);
    const [createdUrl, setCreatedUrl] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    const loadStats = async (url: any) => {
        if (!url.isPublic && !token) {
            alert("Authorization required");
            return;
        }

        const res = await fetch(
            `http://host.docker.internal:57000/api/urls/${url.id}/stats`,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            }
        );

        if (!res.ok) {
            alert("Access denied");
            return;
        }

        const data = await res.json();
        setStats(data);
    };

    return (
        <div className="flex gap-8">
            <UrlsPanel
                token={token}
                onSelect={loadStats}
            />

            <StatsPanel stats={stats} />

            <div className="flex flex-col gap-4 flex-1 items-end">

                <input
                    readOnly
                    value={token}
                    placeholder="Bearer token"
                    className="w-[420px] p-2 border rounded bg-gray-50"
                />

                <CreateSession onToken={setToken} />
                <GetSession token={token} onSession={setSession} />
                <CreateUrl token={token} onCreated={setCreatedUrl} />

                <SessionInfo session={session} url={createdUrl} />
            </div>

        </div>
    );
}
