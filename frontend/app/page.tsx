"use client";

import {UrlsPanel} from "@/components/urls/UrlsPanel";
import {CreateSession} from "@/components/session/CreateSession";
import {GetSession} from "@/components/session/GetSession";
import {SessionInfo} from "@/components/session/SessionInfo";
import {useSession} from "@/hooks/useSession";
import {CreateUrl} from "@/components/urls/CreateUrl";
import {useState} from "react";
import {UrlItem} from "@/types/url";

export default function Page() {
    const {
        token,
        setToken,
        session,
        createSession,
        loadSession,
    } = useSession();

    const [createdUrl, setCreatedUrl] = useState<UrlItem | null>(null);

    return (
        <div className="h-screen p-4">
            <div className="flex gap-4 h-full">

                <div className="w-2/3 h-full">
                    <UrlsPanel token={token}/>
                </div>

                <div className="w-1/3 flex flex-col gap-4">
                    <textarea
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        placeholder="Paste Bearer token here"
                        rows={3}
                        className="w-full p-2 border rounded bg-gray-50 text-xs resize-none"
                    />
                    <CreateSession onCreate={createSession}/>

                    <GetSession onGet={loadSession} disabled={!token}/>

                    <CreateUrl token={token} onCreated={setCreatedUrl}/>

                    <SessionInfo session={session} createdUrl={createdUrl}/>
                </div>
            </div>
        </div>

    );
}

