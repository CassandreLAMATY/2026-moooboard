import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
import requireAccessToken from "../middlewares/requireAccessToken";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    try {
        return await handleError(event, async () => {
            const accessToken = await requireAccessToken(event);

            const data: {
                ok: boolean;
                message: string;
            } = await $fetch(`${config.backendBaseUrl}/auth/logout`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            });

            setResponseStatus(event, 200);

            deleteCookie(event, "access_token");
            deleteCookie(event, "refresh_token");

            return {
                ok: true,
                message: data.message,
            };
        });
    } catch (error) {
        if (error instanceof Exception) {
            return { ok: error.ok, disconnected: error.disconnected, message: error.message, code: error.code };
        }

        setResponseStatus(event, 500);

        return { ok: false, disconnected: false, message: "An error occured, please try again later" };
    }
});
