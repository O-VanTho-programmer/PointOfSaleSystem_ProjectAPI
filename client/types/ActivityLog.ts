export interface ActivityLog {
    activityId: number;
    action: string;
    entityName: string;
    entityId?: number;
    userId?: number;
    details?: string;
    timestamp: string;
}
