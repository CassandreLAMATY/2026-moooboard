import z from "zod";

export const shortcutTitleSchema = z
    .string({ error: 'This field must be of type "string"' })
    .min(1, { error: "This field must contain at least 1 character" })
    .max(64, { error: "This field must contain at most 64 characters" });

export const shortcutAddressSchema = z
    .string({ error: 'This field must be of type "string"' })
    .min(1, { error: "This field must contain at least 1 character" })
    .max(512, { error: "This field must contain at most 512 characters" })
    .regex(
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        { error: "This field must contain a valid link" },
    );
