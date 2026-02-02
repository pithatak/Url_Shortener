type Props = {
    session?: any;
    createdUrl?: any;
};

export function SessionInfo({session, createdUrl}: Props) {
    if (!session && !createdUrl) {
        return (
            <div className="text-sm text-gray-500">
                No data yet
            </div>
        );
    }

    return (
        <div className="gap-4 flex flex-col">
            {session && (
                <div className="border rounded p-4 text-sm bg-gray-50">
                    <>
                        <div className="font-semibold mb-1">Session</div>
                        <div><b>ID:</b> {session.id}</div>
                        <div><b>Created:</b> {session.createdAt}</div>
                    </>
                </div>
            )}
            {createdUrl && (
                <div className="border rounded p-4 text-sm bg-gray-50">
                    <>
                        <div className="font-semibold mb-1">Created URL</div>
                        <div><b>ID:</b> {createdUrl.id}</div>
                        <div>
                            <b>Short:</b>{" "}
                            <a href={createdUrl.shortUrl} target="_blank" className="text-blue-600 underline">
                                {createdUrl.shortUrl}
                            </a>
                        </div>
                    </>
                </div>
            )}
        </div>
    );
}
