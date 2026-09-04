import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
const config = useRuntimeConfig();

const schema = z.object({
    email: z
        .email({ error: "Field email must contain a valid email address" })
        .max(256, { error: "Field email must contain at most 256 characters" }),
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    const body = await readBody(event);
    const parseBody = schema.safeParse(body);

    if (!parseBody.success) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message:
                parseBody.error.issues[0] && parseBody.error.issues[0].path[0]
                    ? parseBody.error.issues[0].path[0]
                    : parseBody.error.issues[0]
                      ? parseBody.error.issues[0].message
                      : "Invalid forgotten password form",
        };
    }

    const reqBody = {
        email: parseBody.data.email,
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
            } = await $fetch(`${config.backendBaseUrl}/account/update/password/forgotten/send-code`, {
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
