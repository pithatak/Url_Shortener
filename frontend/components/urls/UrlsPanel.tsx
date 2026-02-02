"use client";

import {useUrls} from "@/hooks/useUrls";
import {UrlsTable} from "./UrlsTable";


type Props = {
    token: string;
};

export function UrlsPanel({token}: Props) {
    const {mode, setMode, urls, deleteUrl, reload, showStats} = useUrls(token);

    return (
        <div className="flex flex-col h-full">
            <div className="flex gap-2 mb-2">
                <button
                    onClick={() => {
                        if (mode === "public") {
                            reload();
                        } else {
                            setMode("public");
                        }
                    }}
                    className={`px-3 py-1 rounded border 
                        ${mode === "public"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`
                    }
                >
                    Public
                </button>

                <button
                    onClick={() => setMode("private")}
                    disabled={!token}
                    className={`px-3 py-1 rounded border
                        ${mode === "private"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-black hover:bg-gray-100"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed`
                    }
                >
                    Private
                </button>
            </div>


            <div className="flex-1 overflow-y-auto border rounded">
                <UrlsTable
                    urls={urls}
                    mode={mode}
                    onDelete={deleteUrl}
                    onShowStats={showStats}
                />
            </div>
        </div>
    );
}
