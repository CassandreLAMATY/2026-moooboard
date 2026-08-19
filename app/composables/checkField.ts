import { ZodError } from "zod";
import { shortcutAddressSchema, shortcutTitleSchema } from "~/schemas/shortcutSchemas";

export default function checkField(
    field: string,
    fieldError: Ref<string>,
    type: "shortcutTitle" | "shortcutAddress",
): boolean {
    try {
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
