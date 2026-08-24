import type { Notification } from "~/types/notification";

export default function addNotification(
    notifications: {
        notificationKey: number;
        title: string;
        type: "error" | "success" | "info";
        message: string;
        isRemove: boolean;
    }[],
    timeouts: { notificationKey: number; timeout: NodeJS.Timeout }[],
    payload: Notification,
) {
    const key = Math.max(notifications.length, Math.max(...notifications.map((e) => e.notificationKey)) + 1);

    notifications.push({
        notificationKey: key,
        title: payload.title,
        type: payload.type,
        message: payload.message,
        isRemove: true,
    });

    timeouts.push({
        notificationKey: key,
        timeout: removeNotification(notifications, timeouts, key, 5200),
    });
}
