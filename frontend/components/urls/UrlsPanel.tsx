"use client";

import { useUrls } from "@/hooks/useUrls";
import { UrlsTable } from "./UrlsTable";

type Props = {
    token: string;
};

export function UrlsPanel({ token }: Props) {
    const { mode, setMode, urls, deleteUrl } = useUrls(token);

    return (
        <div className="flex flex-col h-full">

            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => setMode("public")}
                    className={mode === "public" ? "font-bold" : ""}
                >
                    Public
                </button>
                <button
                    onClick={() => setMode("private")}
                    disabled={!token}
                    className={mode === "private" ? "font-bold" : ""}
                >
                    Private
                </button>
            </div>

            <div className="flex-1 overflow-y-auto border rounded">
                <UrlsTable
                    urls={urls}
                    mode={mode}
                    onDelete={deleteUrl}
                />
            </div>

        </div>
    );
}
