"use client";

type Props = {
    onToken: (token: string) => void;
};

export function CreateSession({onToken}: Props) {
    const createSession = async () => {
        try {
            const res = await fetch("http://host.docker.internal:57000/api/session", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Failed to create session");
            }

            const data = await res.json();
            onToken(data.token);
        } catch (e) {
            console.error(e);
            alert("Error creating session");
        }
    };

    return (
        <button
            onClick={createSession}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Create session
        </button>
    );
}
