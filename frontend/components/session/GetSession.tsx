"use client";

type Props = {
    onGet: () => void;
    disabled: boolean;
};

export function GetSession({ onGet, disabled }: Props) {
    return (
        <button
            onClick={onGet}
            disabled={disabled}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
            Get current session
        </button>
    );
}
