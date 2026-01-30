import { useEffect, useState } from "react";
import { UrlsService } from "@/services/urls.service";
import { UrlItem } from "@/types/url";

export function useUrls(token: string) {
    const [mode, setMode] = useState<"public" | "private">("public");
    const [urls, setUrls] = useState<UrlItem[]>([]);

    useEffect(() => {
        const load = async () => {
            const data =
                mode === "public"
                    ? await UrlsService.getPublic()
                    : await UrlsService.getPrivate(token);

            setUrls(data);
        };

        if (mode === "public" || token) {
            load();
        }
    }, [mode, token]);

    const deleteUrl = async (id: number) => {
        await UrlsService.delete(id, token);
        setUrls(prev => prev.filter(u => u.id !== id));
    };

    return {
        mode,
        setMode,
        urls,
        deleteUrl,
    };
}
