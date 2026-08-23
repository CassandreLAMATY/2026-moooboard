import { FetchError } from "ofetch";
import { UAParser } from "ua-parser-js";
import z from "zod";
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

const uuidSchema = z.uuid({
    error: `You must provide a valid UUID`,
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        event.node.res.statusCode = 405;
        return { ok: false, error: "Method not authorized" };
    }

    // Body (code)

    const body = await readBody(event);
    const parseBody = schema.safeParse(body);

    if (!parseBody.success) {
        event.node.res.statusCode = 400;
        return {
            ok: false,
            error: parseBody.error.issues[0] ? parseBody.error.issues[0].path[0] : "Invalid code",
        };
    }

    // UUID

    const uuid = getCookie(event, "uuid");

    if (!uuid) {
        event.node.res.statusCode = 500;
        return {
            ok: false,
            message: "Can't find user's UUID",
        };
    }

    const parseUuid = uuidSchema.safeParse(uuid);

    if (!parseUuid.success) {
        event.node.res.statusCode = 400;
        return {
            ok: false,
            error: parseUuid.error.issues[0] ? parseUuid.error.issues[0].path[0] : "Invalid request",
        };
    }

    // Browser & device

    const userAgent = getRequestHeader(event, "user-agent");

    const { browser, device } = UAParser(userAgent);

    const reqBody = {
        uuid: parseUuid.data,
        code: parseBody.data.code,
        browser: browser.name,
        device: device.is("mobile") ? "mobile" : "desktop",
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
                refresh_token: string;
                access_token: string;
            };
        } = await $fetch(`${config.backendBaseUrl}/account/register/verification`, {
            method: "POST",
            body: reqBody,
        });

        deleteCookie(event, "uuid");

        setCookie(event, "access_token", data.data.access_token, {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 15,
        });

        setCookie(event, "refresh_token", data.data.refresh_token, {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        });

        event.node.res.statusCode = 200;

        return {
            ok: true,
            message: data.message,
        };
    } catch (error) {
        if (error instanceof FetchError) {
            const err: {
                ok: boolean;
                error: {
                    message: string;
                    code: string;
                };
            } = error.data;

            event.node.res.statusCode = error.statusCode || 500;

            return {
                ok: false,
                message: err.error.message,
                code: err.error.code,
            };
        }

        event.node.res.statusCode = 500;

        return {
            ok: false,
            message: "An error occured, please try again later.",
        };
    }
});
