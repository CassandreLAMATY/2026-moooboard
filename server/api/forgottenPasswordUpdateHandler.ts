import { UAParser } from "ua-parser-js";
import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
import requirePasswordToken from "../middlewares/requirePasswordToken";
const config = useRuntimeConfig();

const schema = z.object({
    new_password: z
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
    if (event.node.req.method !== "PUT") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    // Body (password)

    const body = await readBody(event);
    const parseBody = schema.safeParse(body);

    if (!parseBody.success) {
        setResponseStatus(event, 400);

        return {
            ok: false,
            disconnected: false,
            message: parseBody.error.issues[0] ? parseBody.error.issues[0].path[0] : "Invalid new password",
        };
    }

    // Browser & device

    const userAgent = getRequestHeader(event, "user-agent");

    const { browser, device } = UAParser(userAgent);

    const reqBody = {
        new_password: parseBody.data.new_password,
        browser: browser.name,
        device: device.is("mobile") ? "Mobile" : "Desktop",
        app_source: {
            name: config.appName,
            email: config.appEmail,
        },
    };

    try {
        const passwordToken = requirePasswordToken(event);

        return await handleError(event, async () => {
            const data: {
                ok: boolean;
                message: string;
                data: {
                    refresh_token: string;
                    access_token: string;
                };
            } = await $fetch(`${config.backendBaseUrl}/account/update/password/forgotten`, {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${passwordToken}`,
                },
                body: reqBody,
            });

            deleteCookie(event, "password_token");

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
