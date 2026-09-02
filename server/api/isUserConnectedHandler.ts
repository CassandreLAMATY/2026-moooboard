export default defineEventHandler(async (event) => {
    if (event.req.method !== "GET") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    const refreshToken = getCookie(event, "refresh_token");

    if (!refreshToken) {
        return {
            ok: true,
            disconnected: false,
            message: "User not connected",
            data: { isConnected: false },
        };
    }

    return {
        ok: true,
        disconnected: false,
        message: "User connected",
        data: { isConnected: true },
    };
});
