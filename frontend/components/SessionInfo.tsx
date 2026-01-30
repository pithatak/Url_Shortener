type Props = {
    session?: any;
    url?: any;
};

export function SessionInfo({ session, url }: Props) {
    if (!session && !url) {
        return (
            <div className="text-sm text-gray-500 w-[420px] text-right">
                No session data
            </div>
        );
    }

    return (
        <div className="border rounded p-4 w-[420px] text-sm">
            {session && (
                <>
                    <div><b>Session ID:</b> {session.id}</div>
                    <div><b>Created:</b> {session.createdAt}</div>
                </>
            )}

            {url && (
                <>
                    <hr className="my-2" />
                    <div><b>URL ID:</b> {url.id}</div>
                    <div>
                        <b>Short URL:</b>{" "}
                        <a
                            href={url.shortUrl}
                            target="_blank"
                            className="text-blue-600 underline"
                        >
                            {url.shortUrl}
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}
