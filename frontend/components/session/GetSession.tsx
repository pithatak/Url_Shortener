"use client";
import { useState } from "react";

type Props = {
    onGet: () => Promise<void>;
    disabled: boolean;
};

export function GetSession({ onGet, disabled }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onGet();
        setLoading(false);
    };

    return (
        <button onClick={handleClick} disabled={disabled || loading}
            className=" px-4 py-3 rounded text-white font-semibold bg-green-600 hover:bg-green-700
            disabled:opacity-50 transition"
        >
            {loading ? "Loading session..." : "Get current session"}
        </button>
    );
}
