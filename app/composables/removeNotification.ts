export default function removeNotification(
    notifications: {
        notificationKey: number;
        title: string;
        type: "error" | "success" | "info";
        message: string;
        isRemove: boolean;
    }[],
    timeouts: { notificationKey: number; timeout: NodeJS.Timeout }[],
    notificationKey: number,
    timeout: number,
): NodeJS.Timeout {
    return setTimeout(() => {
        notifications.splice(
            notifications.findIndex((e) => e.notificationKey === notificationKey),
            1,
        );

        timeouts.splice(
            timeouts.findIndex((e) => e.notificationKey === notificationKey),
            1,
        );
    }, timeout);
}
