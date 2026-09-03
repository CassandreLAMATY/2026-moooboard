import { Exception } from "../core/errors/Exception";
import handleError from "../middlewares/handleError";
import requireAccessToken from "../middlewares/requireAccessToken";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "GET") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    try {
        return await handleError(event, async () => {
            const accessToken = await requireAccessToken(event);

            const data: {
                ok: boolean;
                message: string;
                data: {
                    user: {
                        uuid: string;
                        username: string;
                        role: string;
                        status: string;
                        buddy: {
                            id: number;
                            name: string;
                            formatted_name: string;
                            image_base_url: string;
                        };
                        created_at: Date;
                        updated_at: Date;
                    };
                };
            } = await $fetch(`${config.backendBaseUrl}/user/me`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
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
