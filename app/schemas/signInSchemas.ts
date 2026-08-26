import z from "zod";

export const signInUsernameSchema = z
    .string({ error: 'This field must be of type "string"' })
    .min(1, { error: "This field must contain at least 1 character" })
    .max(16, { error: "This field must contain at most 16 characters" })
    .regex(/^(?=.*[A-Za-z])[A-Za-z0-9 _-]+$/, {
        error: "This field can only contain letters, numbers, spaces and -_, and must contain at lease 1 letter",
    });

export const signInEmailSchema = z
    .email({ error: "This field must contain a valid email address" })
    .max(256, { error: "This field must contain at most 256 characters" });

export const signInPasswordSchema = z
    .string({
        error: 'This field must be of type "string"',
    })
    .min(8, {
        error: "This field must contain at least 8 characters",
    })
    .max(32, {
        error: "This field must contain at most 32 characters",
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-])[a-zA-Z0-9_#?!@$%^&*-]+$/, {
        error: "This field can only contain letters, numbers, and _#?!@$%^&*-",
    });

export const signInLoginPasswordSchema = z
    .string({
        error: "This field must contain a valid password",
    })
    .min(8, {
        error: "This field must contain a valid password",
    })
    .max(32, {
        error: "This field must contain a valid password",
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-])[a-zA-Z0-9_#?!@$%^&*-]+$/, {
        error: "This field must contain a valid password",
    });
