import { FetchError } from "ofetch";

export default async function getUsername(
    isLoggedIn: Ref<boolean>,
    username: Ref<string>,
    email: Ref<string>,
    notifications: {
        notificationKey: number;
        title: string;
        type: "error" | "success" | "info";
        message: string;
        isRemove: boolean;
    }[],
    timeouts: { notificationKey: number; timeout: NodeJS.Timeout }[],
) {
    try {
        const data = await $fetch<{
            data: {
                username: string;
            };
        }>("/api/meHandler", {
            method: "GET",
        });

        isLoggedIn.value = true;
        username.value = data.data.username;
    } catch (error) {
        if (error instanceof FetchError) {
            const err: {
                ok: boolean;
                disconnected: boolean;
                message: string;
            } = error.data;

            if (err.disconnected) {
                resetData(isLoggedIn, username, email);
            }

            addNotification(notifications, timeouts, {
                title: "An error occured",
                type: "error",
                message: err.message,
            });

            return;
        }
    }
}
