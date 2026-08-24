export class AppException extends Error {
    public message: string;
    public code: string;

    constructor(error: { message: string; code: string }) {
        super();

        this.message = error.message;
        this.code = error.code;
    }
}
