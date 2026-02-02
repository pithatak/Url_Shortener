import { apiFetch } from "./api";
import { Session } from "@/types/session";

export const SessionService = {
    create(): Promise<{ token: string }> {
        return apiFetch("/session", { method: "POST" });
    },

    get(token: string): Promise<Session> {
        return apiFetch("/session", {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};
