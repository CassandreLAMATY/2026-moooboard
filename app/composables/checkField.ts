import { ZodError } from "zod";
import { shortcutAddressSchema, shortcutTitleSchema } from "~/schemas/shortcutSchemas";
import { signInEmailSchema, signInPasswordSchema, signInUsernameSchema } from "~/schemas/signInSchemas";

export default function checkField(
    field: string,
    fieldError: Ref<string>,
    type: "shortcutTitle" | "shortcutAddress" | "username" | "email" | "password",
): boolean {
    try {
        if (type === "username") {
            signInUsernameSchema.parse(field);
        }

        if (type === "email") {
            signInEmailSchema.parse(field);
        }

        if (type === "password") {
            signInPasswordSchema.parse(field);
        }

        // Shortcut

        if (type === "shortcutTitle") {
            shortcutTitleSchema.parse(field);
        }

        if (type === "shortcutAddress") {
            shortcutAddressSchema.parse(field);
        }

        return true;
    } catch (error) {
        fieldError.value = "This field is invalid.";

        if (error instanceof ZodError) {
            const regex = /: ([a-zA-Z0-9 ,.-_]+)$/;

            fieldError.value = error.issues[0]!.message.match(regex)?.[1] || error.issues[0]!.message;
        }

        return false;
    }
}
