import { FetchError } from "ofetch";
import type { Buddy } from "~/types/buddy";

export default function useBuddies() {
    const selectedBuddyIsLoading = useState<boolean>("selectedBuddyIsLoading", () => true);
    const buddies = useState<Buddy[]>("buddies", () => []);
    const isLoaded = useState("buddiesLoaded", () => false);

    const { isLoggedIn, selectedBuddy, defaultBuddy, resetData } = useAppStates();
    const { addNotification } = useNotification();

    async function fetchBuddies(force = false) {
        if (isLoaded.value && !force) {
            return;
        }

        try {
            const res = await $fetch<{ data: Buddy[] }>("/api/fetchBuddiesHandler", {
                method: "GET",
            });

            buddies.value = res.data;
            isLoaded.value = true;
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
        }
    }

    async function fetchSelectedBuddy() {
        if (!isLoggedIn.value) {
            const buddyId = localStorage.getItem("moooboard:buddy");
            if (!buddyId) {
                selectedBuddyIsLoading.value = false;
                return;
            }

            const parsedBuddyId = Number.parseInt(buddyId);
            if (Number.isNaN(parsedBuddyId)) {
                selectedBuddyIsLoading.value = false;

                addNotification({
                    title: "An error occured",
                    type: "error",
                    message: `Your previous working buddy couldn't be found so say hello to miss cow instead`,
                });

                localStorage.removeItem("moooboard:buddy");
            }

            try {
                const res = await $fetch<{
                    data: Buddy;
                }>(`/api/fetchBuddyByIdHandler/${buddyId}`, {
                    method: "GET",
                });

                selectedBuddy.value = res.data;

                return;
            } catch (error) {
                console.log(error);
                if (error instanceof FetchError) {
                    const err: {
                        ok: boolean;
                        disconnected: boolean;
                        message: string;
                        code: string;
                    } = error.data;

                    if (err.disconnected) {
                        resetData();
                    }

                    if (err.code === "E06004") {
                        addNotification({
                            title: "An error occured",
                            type: "error",
                            message: `Your previous working buddy couldn't be found so say hello to miss cow instead`,
                        });

                        localStorage.removeItem("moooboard:buddy");
                    } else {
                        addNotification({
                            title: "An error occured",
                            type: "error",
                            message: `Your previous working buddy couldn't be fetched so say hello to miss cow instead`,
                        });
                    }
                }

                return;
            } finally {
                selectedBuddyIsLoading.value = false;
            }
        }
    }

    async function updateSelectedBuddy(buddy: Buddy) {
        selectedBuddy.value = buddy;

        if (!isLoggedIn.value) {
            localStorage.setItem("moooboard:buddy", buddy.toString());

            return;
        }

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
            }>("/api/updateHandler", {
                method: "PUT",
                body: {
                    buddy_id: buddy.id,
                },
            });

            selectedBuddy.value = res.data.buddy;

            return;
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

            return;
        }
    }

    function resetBuddy() {
        selectedBuddy.value = defaultBuddy.value;
    }

    return {
        defaultBuddy,
        selectedBuddy,
        selectedBuddyIsLoading,
        buddies,
        isLoaded,
        fetchBuddies,
        fetchSelectedBuddy,
        updateSelectedBuddy,
        resetBuddy,
    };
}
