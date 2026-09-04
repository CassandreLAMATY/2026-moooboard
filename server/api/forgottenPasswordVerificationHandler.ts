import { UAParser } from "ua-parser-js";
import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
const config = useRuntimeConfig();

const schema = z.object({
    code: z
        .string({
            error: `Field code must be of type "string"`,
        })
        .length(6, {
            error: `Field code must contain 6 digits`,
        })
        .regex(/^[0-9]{6}$/, {
            error: `Field code must contain 6 digits`,
        }),
});

const uuidSchema = z.uuidv4({
    error: `You must provide a valid authentication UUID`,
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    // Body (code)

    const body = await readBody(event);
    const parseBody = schema.safeParse(body);

    if (!parseBody.success) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message: parseBody.error.issues[0] ? parseBody.error.issues[0].path[0] : "Invalid code",
        };
    }

    // UUID

    const uuid = getCookie(event, "forgotten_password_uuid");

    if (!uuid) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message: "Please restart the procedure and follow every step properly",
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
        code: parseBody.data.code,
    };

    try {
        return await handleError(event, async () => {
            const data: {
                ok: boolean;
                message: string;
                data: {
                    password_token: string;
                };
            } = await $fetch(`${config.backendBaseUrl}/account/update/password/forgotten/verification`, {
                method: "POST",
                body: reqBody,
            });

            deleteCookie(event, "forgotten_password_uuid");

            setCookie(event, "password_token", data.data.password_token, {
                httpOnly: true,
                secure: config.nodeEnv === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 15,
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
