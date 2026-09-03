import z from "zod";
import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
import requireAccessToken from "../middlewares/requireAccessToken";
const config = useRuntimeConfig();

const schema = z.object({
    username: z
        .string({
            error: 'Field username must be of type "string"',
        })
        .min(3, { error: "Field username must contain at least 3 characters" })
        .max(16, { error: "Field username must contain at most 16 characters" })
        .optional(),
    buddy_id: z.number({ error: "Field buddy_id must be a number" }).optional(),
});

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "PUT") {
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
                      : "Invalid request",
        };
    }

    const reqBody = {
        username: parseBody.data.username,
        buddy_id: parseBody.data.buddy_id,
    };

    try {
        return await handleError(event, async () => {
            const accessToken = await requireAccessToken(event);

            const data: {
                ok: boolean;
                message: string;
                data: {
                    user: {
                        username: string;
                        buddy: {
                            id: number;
                            name: string;
                            formatted_name: string;
                            image_base_url: string;
                        };
                    };
                };
            } = await $fetch(`${config.backendBaseUrl}/account/update`, {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
                body: reqBody,
            });

            setResponseStatus(event, 200);

            return {
                ok: true,
                disconnected: false,
                message: data.message,
                data: data.data.user,
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
