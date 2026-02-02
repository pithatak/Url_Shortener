"use client";
import { useState } from "react";

type Props = {
    onCreate: () => Promise<void>;
};

export function CreateSession({ onCreate }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onCreate();
        setLoading(false);
    };

    return (
        <button onClick={handleClick} disabled={loading}
            className="px-4 py-3 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700
            disabled:opacity-50 transition"
        >
            {loading ? "Creating session..." : "Create session"}
        </button>
    );
}
