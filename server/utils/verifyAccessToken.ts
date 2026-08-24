import jwt from "jsonwebtoken";

import { AppException } from "../core/errors/AppException";
import { errorCatalog } from "../core/errors/ErrorCatalog";

import readFile from "./readFile";

export default function verifyAccessToken(token: string): {
    sub: string;
    rol: any;
    typ: any;
    sid: any;
    iat: number;
    exp: number;
} {
    try {
        const publicKey = readFile("server/config/secrets/jwt_access_public.pem");

        const payload = jwt.verify(token, publicKey);

        if (typeof payload === "string") throw new AppException(errorCatalog.INVALID_ACCESS_TOKEN);

        if (!payload.sub || !payload.rol || !payload.typ || !payload.sid || !payload.iat || !payload.exp) {
            throw new AppException(errorCatalog.INVALID_ACCESS_TOKEN);
        }

        if (payload.typ !== "access") {
            throw new AppException(errorCatalog.INVALID_ACCESS_TOKEN);
        }

        return {
            sub: payload.sub,
            rol: payload.rol,
            typ: payload.typ,
            sid: payload.sid,
            iat: payload.iat,
            exp: payload.exp,
        };
    } catch (error) {
        if (error instanceof AppException) {
            throw error;
        }

        throw new AppException({ message: "An error occured while trying to verify your access token", code: "E6001" });
    }
}
