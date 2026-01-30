import { useState } from "react";
import { SessionService } from "@/services/session.service";
import { Session } from "@/types/session";

export function useSession() {
    const [token, setToken] = useState("");
    const [session, setSession] = useState<Session | null>(null);

    const createSession = async () => {
        const { token } = await SessionService.create();
        setToken(token);
    };

    const loadSession = async () => {
        if (!token) return;
        const data = await SessionService.get(token);
        setSession(data);
    };

    return {
        token,
        session,
        createSession,
        loadSession,
    };
}
