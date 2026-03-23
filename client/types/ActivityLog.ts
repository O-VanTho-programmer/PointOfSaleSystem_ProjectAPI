export interface ActivityLog {
    activityId: number;
    action: string;
    entityName: EntityName;
    entityId?: number;
    userId?: number;
    details?: string;
    timestamp: string;
}

export type EntityName = 'Item' | 'Order' | 'User';
