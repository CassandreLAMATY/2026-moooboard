import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
const config = useRuntimeConfig();

const uuidSchema = z.uuidv4({
    error: `You must provide a valid authentication UUID`,
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    // UUID

    const uuid = getCookie(event, "forgotten_password_uuid");

    if (!uuid) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message: "Please log in first or use the link in the last email you received from us to proceed",
        };
    }

    const parseUuid = uuidSchema.safeParse(uuid);

    if (!parseUuid.success) {
        setResponseStatus(event, 400);

        deleteCookie(event, "forgotten_password_uuid");

        return {
            ok: false,
            disconnected: true,
            message:
                parseUuid.error.issues[0] && parseUuid.error.issues[0].path[0]
                    ? parseUuid.error.issues[0].path[0]
                    : parseUuid.error.issues[0]
                      ? parseUuid.error.issues[0].message
                      : "Invalid request",
        };
    }

    const reqBody = {
        uuid: parseUuid.data,
        app_source: {
            name: config.appName,
            email: config.appEmail,
        },
    };

    try {
        return await handleError(event, async () => {
            const data: {
                ok: boolean;
                message: string;
                data: {
                    uuid: string;
                };
            } = await $fetch(`${config.backendBaseUrl}/account/update/password/forgotten/resend-code`, {
                method: "POST",
                body: reqBody,
            });

            setCookie(event, "forgotten_password_uuid", data.data.uuid, {
                httpOnly: true,
                secure: config.nodeEnv === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 10,
            });

            setResponseStatus(event, 200);

            return {
                ok: true,
                disconnected: false,
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
