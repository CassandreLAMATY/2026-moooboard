import { FetchError } from "ofetch";
import { AppException } from "../core/errors/AppException";
import verifyAccessToken from "../utils/verifyAccessToken";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "GET") {
        event.node.res.statusCode = 405;
        return { ok: false, disconnected: false, error: "Method not authorized" };
    }

    let accessToken = getCookie(event, "access_token");

    if (!accessToken) {
        const refreshToken = getCookie(event, "refresh_token");

        if (!refreshToken) {
            event.node.res.statusCode = 500;

            return {
                ok: false,
                disconnected: true,
                message: "You are not connected. Please, log in first",
            };
        }

        try {
            const data = await refreshSession(refreshToken);

            setCookie(event, "access_token", data.accessToken, {
                httpOnly: true,
                secure: config.nodeEnv === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 15,
            });
            setCookie(event, "refresh_token", data.refreshToken, {
                httpOnly: true,
                secure: config.nodeEnv === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            });

            accessToken = data.accessToken;
        } catch (error) {
            event.node.res.statusCode = 500;

            if (error instanceof AppException) {
                if (error.code === "E6000") {
                    deleteCookie(event, "access_token");
                    deleteCookie(event, "refresh_token");

                    return {
                        ok: false,
                        disconnected: true,
                        message:
                            "An error occured while attempting to refresh your session. You have been disconnected",
                    };
                }

                return {
                    ok: false,
                    disconnected: false,
                    message: error.message,
                };
            }

            return {
                ok: false,
                disconnected: false,
                message: `An error occured while attempting to refresh your session`,
            };
        }
    }

    try {
        verifyAccessToken(accessToken);

        const data: {
            ok: boolean;
            message: string;
            data: {
                user: {
                    uuid: string;
                    username: string;
                    email: string;
                    role: string;
                    status: string;
                    created_at: Date;
                    updated_at: Date;
                };
            };
        } = await $fetch(`${config.backendBaseUrl}/user/me`, {
            method: "POST",
            body: {
                access_token: accessToken,
            },
        });

        event.node.res.statusCode = 200;

        return {
            ok: true,
            disconnected: false,
            message: data.message,
            data: data.data.user,
        };
    } catch (error) {
        event.node.res.statusCode = 500;

        if (error instanceof AppException) {
            if (error.code === "E6000") {
                deleteCookie(event, "refresh_token");

                return {
                    ok: false,
                    disconnected: true,
                    message: "An error occured while attempting to refresh your session. You have been disconnected",
                };
            }

            return {
                ok: false,
                disconnected: false,
                message: error.message,
            };
        }

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
                    disconnected: false,
                    message: "An error occured, please try again later",
                };
            }

            event.node.res.statusCode = error.statusCode || 500;

            return {
                ok: false,
                disconnected: false,
                message: err.error.message,
            };
        }

        event.node.res.statusCode = 500;

        return {
            ok: false,
            disconnected: false,
            message: "An error occured, please try again later",
        };
    }
});
