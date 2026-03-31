export const getTodayDateRange = () => {
    const today = new Date();
    // Create boundaries for the local day
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    // Transmit to backend in UTC
    return {
        startDate: start.toISOString(),
        endDate: end.toISOString()
    };
};

/**
 * Parses a naive datetime string from the server (e.g. "2026-03-14T09:00:00")
 * into a valid Date object by appending the server's timezone offset.
 * Assumes the server is producing Vietnam Time (+07:00).
 */
export const parseServerDate = (serverDateStr: string | Date | undefined): Date => {
    if (!serverDateStr) return new Date();
    if (serverDateStr instanceof Date) return serverDateStr;

    // If it already has a timezone indicator like Z or +07:00, use it directly
    if (serverDateStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(serverDateStr)) {
        return new Date(serverDateStr);
    }

    // Since backend uses DateTime.UtcNow for saving to Db, missing identifiers should default to UTC
    return new Date(`${serverDateStr}Z`);
};

export const formatServerDateTime = (serverDateStr: string | undefined): string => {
    if (!serverDateStr) return "—";
    const date = parseServerDate(serverDateStr);
    return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatServerTimeOnly = (serverDateStr: string | undefined): string => {
    if (!serverDateStr) return "—";
    const date = parseServerDate(serverDateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};