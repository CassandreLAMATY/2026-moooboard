import { AppException } from "../core/errors/AppException";
import { Exception } from "../core/errors/Exception";
import { NitroEvent } from "../core/types/NitroEvent";
const config = useRuntimeConfig();

export default async function requireAccessToken(event: NitroEvent) {
    let accessToken: string | undefined = getCookie(event, "access_token");

    if (!accessToken) {
        const refreshToken = getCookie(event, "refresh_token");

        if (!refreshToken) {
            throw new Exception({
                ok: false,
                disconnected: true,
                message: "You are not connected. Please, log in first",
            });
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
            if (error instanceof AppException) {
                if (error.code === "E6000") {
                    deleteCookie(event, "access_token");
                    deleteCookie(event, "refresh_token");

                    throw new Exception({
                        ok: false,
                        disconnected: true,
                        message:
                            "An error occured while attempting to refresh your session. You have been disconnected",
                    });
                }

                throw new Exception({
                    ok: false,
                    disconnected: false,
                    message: error.message,
                });
            }

            throw new Exception({
                ok: false,
                disconnected: false,
                message: `An error occured while attempting to refresh your session`,
            });
        }
    }

    return accessToken;
}
