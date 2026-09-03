import { type Notification } from "~/types/notification";
import { type NotificationTimeout } from "~/types/notificationTimeout";

export default function useNotification() {
    const notifications = useState<Notification[]>("notifications", () => []);
    const timeouts = useState<NotificationTimeout[]>("notificationTimeouts", () => []);

    function addNotification(payload: { title: string; type: "info" | "success" | "error"; message: string }) {
        const key = Math.max(
            notifications.value.length,
            Math.max(...notifications.value.map((e) => e.notificationKey)) + 1,
        );

        notifications.value.push({
            notificationKey: key,
            title: payload.title,
            type: payload.type,
            message: payload.message,
        });

        timeouts.value.push({
            notificationKey: key,
            timeout: removeNotification(key, 5200),
        });
    }

    function removeNotification(notificationKey: number, timeout: number): NodeJS.Timeout {
        return setTimeout(() => {
            notifications.value.splice(
                notifications.value.findIndex((e) => e.notificationKey === notificationKey),
                1,
            );

            timeouts.value.splice(
                timeouts.value.findIndex((e) => e.notificationKey === notificationKey),
                1,
            );
        }, timeout);
    }

    function deleteNotification(notificationKey: number) {
        notifications.value.splice(
            notifications.value.findIndex((e) => e.notificationKey === notificationKey),
            1,
        );
    }

    function stopTimeout(notificationKey: number) {
        const timeout = timeouts.value[timeouts.value.findIndex((e) => e.notificationKey === notificationKey)];

        clearTimeout(timeout?.timeout);

        timeouts.value.splice(
            timeouts.value.findIndex((e) => e.notificationKey === notificationKey),
            1,
        );
    }

    function restartTimeout(notificationKey: number) {
        timeouts.value.push({
            notificationKey: notificationKey,
            timeout: removeNotification(notificationKey, 5200),
        });
    }

    return {
        notifications,
        timeouts,
        addNotification,
        removeNotification,
        deleteNotification,
        stopTimeout,
        restartTimeout,
    };
}
