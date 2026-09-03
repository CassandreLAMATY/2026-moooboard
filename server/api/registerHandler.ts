import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
const config = useRuntimeConfig();

const schema = z.object({
    username: z
        .string({ error: 'Field username must be of type "string"' })
        .min(1, { error: "Field username must contain at least 1 character" })
        .max(16, { error: "Field username must contain at most 16 characters" })
        .regex(/^(?=.*[A-Za-z])[A-Za-z0-9 _-]+$/, {
            error: "Field username can only contain letters, numbers, spaces and -_, and must contain at lease 1 letter",
        }),

    email: z
        .email({ error: "Field email must contain a valid email address" })
        .max(256, { error: "Field email must contain at most 256 characters" }),

    password: z
        .string({
            error: 'Field password must be of type "string"',
        })
        .min(8, {
            error: "Field password must contain at least 8 characters",
        })
        .max(32, {
            error: "Field password must contain at most 32 characters",
        })
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-])[a-zA-Z0-9_#?!@$%^&*-]+$/, {
            error: "Field password can only contain letters, numbers, and _#?!@$%^&*-",
        }),
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
                      : "Invalid registration form",
        };
    }

    const reqBody = {
        username: parseBody.data.username,
        email: parseBody.data.email,
        password: parseBody.data.password,
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
            } = await $fetch(`${config.backendBaseUrl}/account/register`, {
                method: "POST",
                body: reqBody,
            });

            setCookie(event, "uuid", data.data.uuid, {
                httpOnly: true,
                secure: config.nodeEnv === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24,
            });

            setResponseStatus(event, 200);

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
