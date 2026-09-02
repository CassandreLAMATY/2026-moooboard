import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
const config = useRuntimeConfig();

const schema = z.uuidv4({
    error: `You must provide a valid UUID`,
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    const uuid = getCookie(event, "uuid");

    if (!uuid) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message: "Can't find user's UUID",
        };
    }

    const parseUuid = schema.safeParse(uuid);

    if (!parseUuid.success) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message: parseUuid.error.issues[0] ? parseUuid.error.issues[0].path[0] : "Invalid request",
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
            } = await $fetch(`${config.backendBaseUrl}/account/register/resend-code`, {
                method: "POST",
                body: reqBody,
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
