import { FetchError } from "ofetch";
import { AppException } from "../core/errors/AppException";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        event.node.res.statusCode = 405;
        return { ok: false, error: "Method not authorized" };
    }

    let accessToken = getCookie(event, "access_token");

    if (!accessToken) {
        const refreshToken = getCookie(event, "refresh_token");

        if (!refreshToken) {
            event.node.res.statusCode = 500;

            return {
                ok: false,
                message: "You are already not connected",
            };
        }

        try {
            const data = await refreshSession(refreshToken);

            accessToken = data.accessToken;
        } catch (error) {
            event.node.res.statusCode = 500;

            deleteCookie(event, "access_token");
            deleteCookie(event, "refresh_token");

            if (error instanceof AppException) {
                if (error.code === "E6000") {
                    return {
                        ok: false,
                        message:
                            "An error occured while attempting to refresh your session. Don't worry, you still have been disconnected on client side",
                    };
                }

                return {
                    ok: false,
                    message: `${error.message}. Don't worry, you still have been disconnected on client side`,
                };
            }

            return {
                ok: false,
                message: `An error occured while attempting to refresh your session. Don't worry, you still have been disconnected on client side`,
            };
        }
    }

    try {
        verifyAccessToken(accessToken);

        const data: {
            ok: boolean;
            message: string;
        } = await $fetch(`${config.backendBaseUrl}/account/logout`, {
            method: "POST",
            body: {
                access_token: accessToken,
            },
        });

        event.node.res.statusCode = 200;

        deleteCookie(event, "access_token");
        deleteCookie(event, "refresh_token");

        return {
            ok: true,
            message: data.message,
        };
    } catch (error) {
        deleteCookie(event, "access_token");
        deleteCookie(event, "refresh_token");

        if (error instanceof FetchError) {
            const err:
                | {
                      ok: boolean;
                      error: {
                          message: string;
                          code: string;
                      };
                  }
                | undefined = error.data;

            if (!err) {
                event.node.res.statusCode = 500;

                return {
                    ok: false,
                    message: "An error occured. Don't worry, you still have been disconnected on client side",
                };
            }

            event.node.res.statusCode = error.statusCode || 500;

            return {
                ok: false,
                message: `${err.error.message}. Don't worry, you still have been disconnected on client side`,
            };
        }

        event.node.res.statusCode = 500;

        return {
            ok: false,
            message: "An error occured. Don't worry, you still have been disconnected on client side",
        };
    }
});
