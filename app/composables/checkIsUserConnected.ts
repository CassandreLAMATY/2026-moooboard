export default async function checkIsUserConnected() {
    try {
        const data = await $fetch<{ isConnected: boolean }>("/api/isUserConnectedHandler", {
            method: "GET",
        });

        return data.isConnected;
    } catch (error) {
        return false;
    }
}
