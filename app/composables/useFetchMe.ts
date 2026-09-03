import { FetchError } from "ofetch";

export default async function useFetchMe() {
    const { addNotification } = useNotification();
    const { isLoggedIn, username, resetData } = useAppStates();
    const { selectedBuddy, selectedBuddyIsLoading } = useBuddies();

    try {
        const res = await $fetch<{
            data: {
                username: string;
                buddy: {
                    id: number;
                    name: string;
                    formatted_name: string;
                    image_base_url: string;
                };
            };
        }>("/api/meHandler", {
            method: "GET",
        });

        isLoggedIn.value = true;
        username.value = res.data.username;
        selectedBuddy.value = res.data.buddy;
    } catch (error) {
        if (error instanceof FetchError) {
            const err: {
                ok: boolean;
                disconnected: boolean;
                message: string;
            } = error.data;

            if (err.disconnected) {
                resetData();
            }

            addNotification({
                title: "An error occured",
                type: "error",
                message: err.message,
            });
        }
    } finally {
        selectedBuddyIsLoading.value = false;
    }
}
