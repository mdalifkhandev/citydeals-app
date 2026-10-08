export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
}

export interface NotificationListResponse {
  items: Notification[];
  meta: NotificationListMeta;
}
