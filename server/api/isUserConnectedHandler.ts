export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "GET") {
        event.node.res.statusCode = 405;
        return { ok: false, error: "Method not authorized" };
    }

    const refreshToken = getCookie(event, "refresh_token");

    if (!refreshToken) {
        return {
            isConnected: false,
        };
    }

    return {
        isConnected: true,
    };
});
