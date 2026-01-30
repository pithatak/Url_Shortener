const API_URL = "http://host.docker.internal:57000/api";

export async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_URL}${url}`, options);

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res.json();
}
