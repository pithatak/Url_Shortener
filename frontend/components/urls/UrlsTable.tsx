import { UrlItem } from "@/types/url";

type Props = {
    urls: UrlItem[];
    mode: "public" | "private";
    onDelete: (id: number) => void;
};

export function UrlsTable({ urls, mode, onDelete }: Props) {
    return (
        <table className="w-full text-sm">
            <thead>
            <tr>
                <th>ID</th>
                <th>Original</th>
                <th>Short</th>
                <th>Expires</th>

                {mode === "private" && <th>Actions</th>}
            </tr>
            </thead>

            <tbody>
            {urls.map(u => (
                <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.originalUrl}</td>
                    <td>{u.shortCode}</td>
                    <td>{u.expiresAt ?? "—"}</td>

                    {mode === "private" && (
                        <td>
                            <button onClick={() => onDelete(u.id)}>
                                Delete
                            </button>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
