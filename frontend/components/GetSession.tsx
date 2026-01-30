"use client";

type Props = {
    token: string;
    onSession: (data: any) => void;
};

export function GetSession({token, onSession}: Props) {
    const loadSession = async () => {
        if (!token) {
            alert("Create session first");
            return;
        }

        try {
            const res = await fetch("http://host.docker.internal:57000/api/session", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Unauthorized");
            }

            const data = await res.json();
            onSession(data);
        } catch (e) {
            console.error(e);
            alert("Failed to get session");
        }
    };

    return (
        <button
            onClick={loadSession}
            disabled={!token}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
            Get current session
        </button>
    );
}
