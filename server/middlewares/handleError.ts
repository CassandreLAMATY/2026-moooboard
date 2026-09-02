import { Exception } from "../core/errors/Exception";
import { FetchError } from "ofetch";
import { NitroEvent } from "../core/types/NitroEvent";

export default async function handleError<T>(event: NitroEvent, fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        setResponseStatus(event, 500);

        if (error instanceof Exception) throw error;

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
                throw new Exception({
                    ok: false,
                    disconnected: false,
                    message: "An error occured, please try again later",
                });
            }

            setResponseStatus(event, error.statusCode || 500);

            throw new Exception({
                ok: false,
                disconnected: false,
                message: err.error.message,
                code: err.error.code,
            });
        }

        throw new Exception({
            ok: false,
            disconnected: false,
            message: "An error occured, please try again later",
        });
    }
}
