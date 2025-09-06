const AFF_PARAM = '_fs_affiliate';

type SameSiteMode = 'Strict' | 'Lax' | 'None';

export class Affiliate {
    private static bootstrapped = false;

    /**
     * Start token capture only (no forwarding). Idempotent.
     * @param ttlDays If greater than 0, the token will be persisted for the specified number of days.
     */
    public static bootstrap(ttlDays?: number): void {
        if (Affiliate.isSsr()) return;
        if (this.bootstrapped) return;
        this.bootstrapped = true;

        this.captureFromUrlAndPersist(ttlDays);
    }

    /** Captures `?_fs_affiliate` from the URL, saves cookie first-party + localStorage, cleans the URL */
    public static captureFromUrlAndPersist(ttlDays?: number): void {
        if (Affiliate.isSsr()) return;
        const token = this.getUrlParam(AFF_PARAM);
        if (!token) return;

        // Persistence “belt and braces”: cookie first-party + localStorage
        try {
            window.localStorage.setItem(AFF_PARAM, token);
        } catch {
            /* ignore */
        }

        const maxAge =
            typeof ttlDays === 'number' && ttlDays > 0
                ? Math.floor(ttlDays * 24 * 60 * 60)
                : undefined;

        this.setCookie(AFF_PARAM, token, { maxAge, sameSite: 'Strict' });

        // Clean the URL
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete(AFF_PARAM);
            window.history.replaceState(
                null,
                '',
                url.pathname + url.search + url.hash
            );
        } catch {
            /* ignore */
        }
    }

    /** Returns the token if present (cookie preferred; fallback localStorage) */
    public static getToken(): string | null {
        if (Affiliate.isSsr()) return null;
        const fromCookie = this.getCookie(AFF_PARAM);
        if (fromCookie) return fromCookie;
        try {
            return window.localStorage.getItem(AFF_PARAM);
        } catch {
            return null;
        }
    }

    /** Cleans the token (cookie + localStorage) */
    public static clear(): void {
        if (Affiliate.isSsr()) return;
        try {
            window.localStorage.removeItem(AFF_PARAM);
        } catch {
            /* ignore */
        }
        this.deleteCookie(AFF_PARAM);
    }

    // ------------------------
    // Helpers (interni)
    // ------------------------

    private static isSsr(): boolean {
        return typeof window === 'undefined' || typeof document === 'undefined';
    }

    private static getUrlParam(name: string): string | null {
        try {
            const url = new URL(window.location.href);
            const v = url.searchParams.get(name);
            return v && v.trim() ? v : null;
        } catch {
            return null;
        }
    }

    private static setCookie(
        name: string,
        value: string,
        opts?: {
            maxAge?: number;
            path?: string;
            domain?: string;
            sameSite?: SameSiteMode;
            secure?: boolean;
        }
    ): void {
        const o = Object.assign(
            { path: '/', sameSite: 'Strict' as SameSiteMode },
            opts || {}
        );
        const parts = [
            `${name}=${encodeURIComponent(value)}`,
            `Path=${o.path}`,
            `SameSite=${o.sameSite}`,
        ];
        if (o.domain) parts.push(`Domain=${o.domain}`);
        if (typeof o.maxAge === 'number') parts.push(`Max-Age=${o.maxAge}`);
        // Secure only if HTTPS or SameSite=None
        if (o.secure || o.sameSite === 'None') parts.push('Secure');

        document.cookie = parts.join('; ');
    }

    private static deleteCookie(name: string): void {
        document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Strict`;
    }

    private static getCookie(name: string): string | null {
        try {
            const map = document.cookie
                .split('; ')
                .reduce<Record<string, string>>((acc, c) => {
                    const i = c.indexOf('=');
                    if (i === -1) return acc;
                    const k = c.substring(0, i);
                    const v = decodeURIComponent(c.substring(i + 1));
                    acc[k] = v;
                    return acc;
                }, {});
            return map[name] || null;
        } catch {
            return null;
        }
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Auto-bootstrap on module load (capture-only).
Affiliate.bootstrap();
