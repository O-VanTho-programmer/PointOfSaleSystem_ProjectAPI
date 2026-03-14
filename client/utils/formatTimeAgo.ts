import { parseServerDate } from '@/utils/dateHelper';

export function formatTimeAgo(isoString: string | undefined): string {
    if (!isoString) return '—';
    const mins = Math.floor((Date.now() - parseServerDate(isoString).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
}