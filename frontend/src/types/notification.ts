export type NotificationType = "law_update" | "new_law" | "citation" | "system";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    lawId?: string;
    lawTitle?: string;
    createdAt: Date | string;
} 