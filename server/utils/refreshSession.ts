import { FetchError } from "ofetch";
import { AppException } from "../core/errors/AppException";
import verifyRefreshToken from "./verifyRefreshToken";

const config = useRuntimeConfig();

export default async function refreshSession(
    refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
    try {
        verifyRefreshToken(refreshToken);

        const data: {
            ok: boolean;
            message: string;
            data: {
                refresh_token: string;
                access_token: string;
            };
        } = await $fetch(`${config.backendBaseUrl}/session/refresh`, {
            method: "POST",
            body: {
                refresh_token: refreshToken,
            },
        });

        return {
            accessToken: data.data.access_token,
            refreshToken: data.data.refresh_token,
        };
    } catch (error) {
        if (error instanceof AppException) throw error;

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
                throw new AppException({
                    message: `An error occured while attempting to refresh your session`,
                    code: "E6002",
                });
            }

            throw new AppException({ message: err.error.message, code: "E5001" });
        }

        throw new AppException({
            message: `An error occured while attempting to refresh your session`,
            code: "E6002",
        });
    }
}
