export type UrlItem = {
    id: number;
    originalUrl: string;
    shortCode: string;
    expiresAt?: string;
    isPublic?: boolean;
};

export type UrlStats = {
    id: number;
    clicks: number;
    createdAt: string;
    expiresAt?: string;
};
