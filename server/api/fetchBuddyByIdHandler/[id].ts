import { Exception } from "../../core/errors/Exception";
import handleError from "../../middlewares/handleError";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== "GET") {
        setResponseStatus(event, 405);

        return { ok: false, disconnected: false, message: "Method not authorized" };
    }

    const id = event.context.params?.id;
    if (!id || (id && Number.isNaN(Number.parseInt(id))))
        return { ok: false, disconnected: false, message: "Please provide a valid id" };

    try {
        return await handleError(event, async () => {
            const res: {
                ok: boolean;
                message: string;
                data: {
                    buddy: {
                        id: number;
                        name: string;
                        formatted_name: string;
                        image_base_url: string;
                    };
                };
            } = await $fetch(`${config.backendBaseUrl}/buddies/${id}`, {
                method: "GET",
            });

            setResponseStatus(event, 200);

            return {
                ok: true,
                disconnected: false,
                message: res.message,
                data: res.data.buddy,
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
