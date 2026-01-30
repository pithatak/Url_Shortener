type Props = {
    stats: any;
};

export function StatsPanel({ stats }: Props) {
    if (!stats) return null;

    return (
        <div className="border rounded p-4 text-sm">
            <h3 className="font-semibold mb-2">Link statistics</h3>

            <div><b>ID:</b> {stats.id}</div>
            <div><b>Clicks:</b> {stats.clicks}</div>
            <div><b>Created:</b> {stats.createdAt}</div>
            <div><b>Expires:</b> {stats.expiresAt ?? "—"}</div>
        </div>
    );
}
