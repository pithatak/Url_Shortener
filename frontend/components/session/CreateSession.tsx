"use client";

type Props = {
    onCreate: () => Promise<void> | void;
};

export function CreateSession({ onCreate }: Props) {
    return (
        <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Create session
        </button>
    );
}
