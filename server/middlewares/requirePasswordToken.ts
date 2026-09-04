import { Exception } from "../core/errors/Exception";
import { NitroEvent } from "../core/types/NitroEvent";

export default function requirePasswordToken(event: NitroEvent): string {
    const passwordToken = getCookie(event, "password_token");

    if (!passwordToken)
        throw new Exception({
            ok: false,
            message: "Please restart the procedure and follow every step properly",
            disconnected: true,
        });

    return passwordToken;
}
