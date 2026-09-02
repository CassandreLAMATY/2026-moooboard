export class Exception extends Error {
    public ok: boolean;
    public message: string;
    public disconnected: boolean;
    public code: string | undefined;

    constructor(error: { ok: boolean; message: string; disconnected: boolean; code?: string }) {
        super();

        this.ok = error.ok;
        this.message = error.message;
        this.disconnected = error.disconnected;
        this.code = error.code;
    }
}
