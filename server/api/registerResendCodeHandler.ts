import { FetchError } from "ofetch";
import z from "zod";
const config = useRuntimeConfig();

const schema = z.uuid({
    error: `You must provide a valid UUID`,
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "POST") {
        event.node.res.statusCode = 405;
        return { ok: false, error: "Method not authorized" };
    }

    const uuid = getCookie(event, "uuid");

    if (!uuid) {
        event.node.res.statusCode = 500;
        return {
            ok: false,
            message: "Can't find user's UUID",
        };
    }

    const parseUuid = schema.safeParse(uuid);

    if (!parseUuid.success) {
        event.node.res.statusCode = 400;
        return {
            ok: false,
            error: parseUuid.error.issues[0] ? parseUuid.error.issues[0].path[0] : "Invalid request",
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
                    disconnected: false,
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
            message: "An error occured, please try again later",
        };
    }
});
