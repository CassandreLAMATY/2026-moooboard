import { FetchError } from "ofetch";

export default async function getUsername(
    isLoggedIn: Ref<boolean>,
    username: Ref<string>,
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
                message: string;
            } = error.data;

            addNotification(notifications, timeouts, {
                title: "An error occured",
                type: "error",
                message: err.message,
            });

            return;
        }
    }
}
