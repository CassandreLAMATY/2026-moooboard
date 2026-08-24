import jwt from "jsonwebtoken";

import { AppException } from "../core/errors/AppException";
import { errorCatalog } from "../core/errors/ErrorCatalog";

import readFile from "./readFile";

export default function verifyRefreshToken(token: string): {
    sub: string;
    rol: string;
    typ: string;
    jti: string;
    iat: number;
    exp: number;
} {
    try {
        const publicKey = readFile("server/config/secrets/jwt_refresh_public.pem");

        const payload = jwt.verify(token, publicKey);

        if (typeof payload === "string") throw new AppException(errorCatalog.INVALID_REFRESH_TOKEN);

        if (!payload.sub || !payload.rol || !payload.typ || !payload.jti || !payload.iat || !payload.exp) {
            throw new AppException(errorCatalog.INVALID_REFRESH_TOKEN);
        }

        if (payload.typ !== "refresh") {
            throw new AppException(errorCatalog.INVALID_REFRESH_TOKEN);
        }

        return {
            sub: payload.sub,
            rol: payload.rol,
            typ: payload.typ,
            jti: payload.jti,
            iat: payload.iat,
            exp: payload.exp,
        };
    } catch (error) {
        if (error instanceof AppException) {
            throw error;
        }

        throw new AppException({
            message: "An error occured while trying to verify your refresh token",
            code: "E6001",
        });
    }
}
