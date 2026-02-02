import {UrlItem} from "@/types/url";

type Props = {
    urls: UrlItem[];
    mode: "public" | "private";
    onDelete: (id: number) => void;
    onShowStats: (url: UrlItem) => void;
};


export function UrlsTable({urls, mode, onDelete, onShowStats}: Props) {
    return (
        <table className="w-full text-sm border border-gray-200 rounded overflow-hidden">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Original</th>
                <th className="px-3 py-2 text-left">Short</th>
                <th className="px-3 py-2 text-left">Expires</th>
                {mode === "private" && (<th className="px-3 py-2 text-left">Actions</th>)}
            </tr>
            </thead>

            <tbody>
            {urls.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{u.id}</td>
                    <td className="px-3 py-2 truncate max-w-[400px]">
                        {u.originalUrl}
                    </td>
                    <td className="px-3 py-2">
                        <a
                            href={`http://localhost:57000/${u.shortCode}`}
                            target="_blank"
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {u.shortCode}
                        </a>
                    </td>
                    <td className="px-3 py-2">{u.expiresAt ?? "—"}</td>

                    {mode === "private" && (
                        <td className="px-3 py-2">
                            <div className="flex gap-2">
                                <button onClick={() => onShowStats(u)}
                                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                >
                                    Stats
                                </button>
                                <button onClick={() => onDelete(u.id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
