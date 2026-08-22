<script setup lang="ts">
import { FetchError } from "ofetch";
import { signInEmailSchema, signInPasswordSchema, signInUsernameSchema } from "~/schemas/signInSchemas";
import type { Notification } from "~/types/notification";

const emit = defineEmits<{
    (event: "notify", payload: Notification): void;
    (event: "submit"): void;
    (event: "openLogin"): void;
    (event: "close"): void;
}>();

const username = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const usernameIsValid = ref(false);
const emailIsValid = ref(false);
const passwordIsValid = ref(false);

const usernameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const passwordConfirmError = ref("");

// Password handling

const isPasswordDisplayed = ref(false);
const isPasswordConfirmDisplayed = ref(false);

const hasBeenFocus = ref(false);
const hasBeenBlur = ref(false);

function focusPassword() {
    hasBeenFocus.value = true;
    passwordError.value = "";
}

//---
// Submit

async function submit() {
    if (usernameIsValid.value && emailIsValid.value && passwordIsValid.value) {
        if (password.value !== passwordConfirm.value) {
            passwordConfirmError.value = "Password confirmation is different from password";

            checkField(username.value, usernameError, "username");
            checkField(email.value, emailError, "email");
            checkField(password.value, passwordError, "password");

            return;
        }

        try {
            await $fetch("/api/registerHandler", {
                method: "POST",
                body: {
                    username: username.value,
                    email: email.value,
                    password: password.value,
                },
            });

            emit("submit");
        } catch (error) {
            if (error instanceof FetchError) {
                const err: {
                    ok: boolean;
                    message: string;
                } = error.data;

                emit("notify", {
                    title: "An error occured",
                    type: "error",
                    message: err.message,
                });
                emit("close");

                return;
            }

            emit("notify", {
                title: "An error occured",
                type: "error",
                message: "An error occured while attempting to submit your registration. Please, try again later.",
            });
            emit("close");
        }

        return;
    }

    if (password.value !== passwordConfirm.value) {
        passwordConfirmError.value = "Password confirmation is different from password";
    }

    checkField(username.value, usernameError, "username");
    checkField(email.value, emailError, "email");
    checkField(password.value, passwordError, "password");

    return;
}

//---
// Watch inputs

watch(username, () => {
    try {
        signInUsernameSchema.parse(username.value);

        usernameIsValid.value = true;
    } catch (error) {
        usernameIsValid.value = false;
    }
});

watch(email, () => {
    try {
        signInEmailSchema.parse(email.value);

        emailIsValid.value = true;
    } catch (error) {
        emailIsValid.value = false;
    }
});

watch(password, () => {
    try {
        signInPasswordSchema.parse(password.value);

        passwordIsValid.value = true;
    } catch (error) {
        passwordIsValid.value = false;
    }
});
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop>
            <div class="header-container">
                <div class="header">
                    <span class="font04 silk01">Create an account</span>

                    <button type="button" @click="$emit('close')">
                        <img src="/images/xmark.svg" alt="Xmark icon" />
                    </button>
                </div>

                <span class="font02 micro02">
                    Already have an account ? <span class="login" @click="$emit('openLogin')">Log In here</span>
                </span>
            </div>

            <form @submit.prevent="submit()">
                <div class="group">
                    <div class="container">
                        <div class="input-container">
                            <label class="font06 silk02" for="username">
                                <span :class="usernameError ? 'err' : ''">*</span> Username
                            </label>

                            <div class="input">
                                <input
                                    class="font07"
                                    type="text"
                                    name="username"
                                    id="username"
                                    v-model="username"
                                    placeholder="John Doe"
                                    @focus="usernameError = ''"
                                />
                                <img v-if="usernameIsValid" src="/images/check.svg" alt="Check icon" />
                                <img v-if="usernameError" src="/images/xmark-red.svg" alt="Xmark icon" />
                            </div>
                        </div>

                        <span class="font05">{{ usernameError }}</span>
                    </div>

                    <div class="container">
                        <div class="input-container">
                            <label class="font06 silk02" for="email">
                                <span :class="emailError ? 'err' : ''">*</span> Email address
                            </label>

                            <div class="input">
                                <input
                                    class="font07"
                                    type="email"
                                    name="email"
                                    id="email"
                                    v-model="email"
                                    placeholder="john.doe@domain.com"
                                    @focus="emailError = ''"
                                />
                                <img v-if="emailIsValid" src="/images/check.svg" alt="Check icon" />
                                <img v-if="emailError" src="/images/xmark-red.svg" alt="Xmark icon" />
                            </div>
                        </div>

                        <span class="font05">{{ emailError }}</span>
                    </div>

                    <div class="password-container">
                        <div class="container">
                            <div class="input-container">
                                <div class="input-header">
                                    <label class="font06 silk02" for="password">
                                        <span :class="passwordError ? 'err' : ''">*</span> Password
                                    </label>

                                    <button type="button" @click="isPasswordDisplayed = !isPasswordDisplayed">
                                        <img v-if="!isPasswordDisplayed" src="/images/eye.svg" alt="Eye icon" />
                                        <img v-else src="/images/eye-close.svg" alt="Closed eye icon" />
                                    </button>
                                </div>

                                <div class="input">
                                    <input
                                        class="font07"
                                        :type="isPasswordDisplayed ? 'text' : 'password'"
                                        name="password"
                                        id="password"
                                        v-model="password"
                                        @focus="focusPassword()"
                                        @blur="hasBeenBlur = true"
                                    />
                                    <img v-if="passwordIsValid" src="/images/check.svg" alt="Check icon" />
                                    <img v-if="passwordError" src="/images/xmark-red.svg" alt="Xmark icon" />
                                </div>
                            </div>

                            <span class="font05">{{ passwordError }}</span>
                        </div>

                        <ul>
                            <li>
                                <img
                                    v-if="password.length >= 8"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="password.length < 8 && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img v-else src="/images/checkbox-grayed.svg" alt="Checkbox icon" />

                                <span :class="`font03 micro03 ${password.length < 8 && hasBeenBlur ? 'err' : ''}`"
                                    >Minimum of 8 characters</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.length <= 32 && hasBeenFocus"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="password.length >= 32 && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img v-else src="/images/checkbox-grayed.svg" alt="Checkbox icon" />

                                <span :class="`font03 micro03 ${password.length >= 32 && hasBeenBlur ? 'err' : ''}`"
                                    >Maximum of 32 characters</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/[a-z]/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/[a-z]/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img v-else src="/images/checkbox-grayed.svg" alt="Checkbox icon" />

                                <span :class="`font03 micro03 ${!password.match(/[a-z]/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 lowercase character</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/[A-Z]/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/[A-Z]/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img v-else src="/images/checkbox-grayed.svg" alt="Checkbox icon" />

                                <span :class="`font03 micro03 ${!password.match(/[A-Z]/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 UPPERCASE character</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/[_#?!@$%^&*-]/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/[_#?!@$%^&*-]/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img v-else src="/images/checkbox-grayed.svg" alt="Checkbox icon" />

                                <span
                                    :class="`font03 micro03 ${!password.match(/[_#?!@$%^&*-]/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 special character _#?!@$%^&*-</span
                                >
                            </li>

                            <li>
                                <img
                                    v-if="password.match(/\d/)"
                                    src="/images/checkbox-checked-green.svg"
                                    alt="Checkbox checked icon"
                                />
                                <img
                                    v-else-if="!password.match(/\d/) && hasBeenBlur"
                                    src="/images/checkbox-red.svg"
                                    alt="Checkbox icon"
                                />
                                <img v-else src="/images/checkbox-grayed.svg" alt="Checkbox icon" />

                                <span :class="`font03 micro03 ${!password.match(/\d/) && hasBeenBlur ? 'err' : ''}`"
                                    >At least 1 number</span
                                >
                            </li>
                        </ul>
                    </div>

                    <div class="container">
                        <div class="input-container">
                            <div class="input-header">
                                <label class="font06 silk02" for="passwordConfirm">
                                    <span :class="passwordConfirmError ? 'err' : ''">*</span> Password confirmation
                                </label>

                                <button type="button" @click="isPasswordConfirmDisplayed = !isPasswordConfirmDisplayed">
                                    <img v-if="!isPasswordConfirmDisplayed" src="/images/eye.svg" alt="Eye icon" />
                                    <img v-else src="/images/eye-close.svg" alt="Closed eye icon" />
                                </button>
                            </div>

                            <div class="input">
                                <input
                                    class="font07"
                                    :type="isPasswordConfirmDisplayed ? 'text' : 'password'"
                                    name="passwordConfirm"
                                    id="passwordConfirm"
                                    v-model="passwordConfirm"
                                    @focus="passwordConfirmError = ''"
                                />
                            </div>
                        </div>

                        <span class="font05">{{ passwordConfirmError }}</span>
                    </div>
                </div>

                <div class="footer">
                    <button class="cancel" type="button">
                        <span class="font02 micro02">Cancel</span>
                    </button>

                    <button class="submit" type="submit">
                        <img src="/images/door-open-arrow-in-green.svg" alt="Door open icon" />
                        <span class="font02 micro02">Register</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/accountSignInPopup.scss";
</style>
