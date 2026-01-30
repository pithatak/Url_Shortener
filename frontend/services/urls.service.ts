import { apiFetch } from "./api";
import { UrlItem, UrlStats } from "@/types/url";

export const UrlsService = {
    getPublic(): Promise<UrlItem[]> {
        return apiFetch("/public");
    },

    getPrivate(token: string): Promise<UrlItem[]> {
        return apiFetch("/urls", {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    delete(id: number, token: string) {
        return apiFetch(`/urls/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    stats(id: number, token?: string): Promise<UrlStats> {
        return apiFetch(`/urls/${id}/stats`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
    },
};
