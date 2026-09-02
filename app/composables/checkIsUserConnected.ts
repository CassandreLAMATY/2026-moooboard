export default async function checkIsUserConnected() {
    try {
        const data = await $fetch<{ data: { isConnected: boolean } }>("/api/isUserConnectedHandler", {
            method: "GET",
        });

        return data.data.isConnected;
    } catch (error) {
        return false;
    }
}
