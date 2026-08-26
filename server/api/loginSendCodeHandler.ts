import { FetchError } from "ofetch";
import z from "zod";
const config = useRuntimeConfig();

const schema = z.object({
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
        event.node.res.statusCode = 405;
        return { ok: false, error: "Method not authorized" };
    }

    const body = await readBody(event);
    const parseBody = schema.safeParse(body);

    if (!parseBody.success) {
        event.node.res.statusCode = 400;
        return {
            ok: false,
            error: parseBody.error.issues[0] ? parseBody.error.issues[0].path[0] : "Invalid login form",
        };
    }

    const reqBody = {
        email: parseBody.data.email,
        password: parseBody.data.password,
        app_source: {
            name: config.appName,
            email: config.appEmail,
        },
    };

    try {
        const data: {
            ok: boolean;
            message: string;
            data: {
                uuid: string;
            };
        } = await $fetch(`${config.backendBaseUrl}/auth/login/send-code`, {
            method: "POST",
            body: reqBody,
        });

        setCookie(event, "authentication_uuid", data.data.uuid, {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 10,
        });

        event.node.res.statusCode = 200;

        return {
            ok: true,
            message: data.message,
        };
    } catch (error) {
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
                    message: "An error occured, please try again later",
                };
            }

            event.node.res.statusCode = error.statusCode || 500;

            return {
                ok: false,
                message: err.error.message,
            };
        }

        event.node.res.statusCode = 500;

        return {
            ok: false,
            message: "An error occured, please try again later.",
        };
    }
});
