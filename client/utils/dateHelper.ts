export const getTodayDateRange = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    return {
        startDate: `${yyyy}-${mm}-${dd}T00:00:00.000`,
        endDate: `${yyyy}-${mm}-${dd}T23:59:59.999`
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
    
    // Server is assumed to be running in GMT+7 based on current setup
    return new Date(`${serverDateStr}+07:00`);
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