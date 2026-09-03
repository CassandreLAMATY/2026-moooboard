<script setup lang="ts">
    import { FetchError } from "ofetch";
    import { signInEmailSchema } from "~/schemas/signInSchemas";

    const emit = defineEmits<{
        (event: "submit", payload: { email: string; type: "login" }): void;
        (event: "openRegister"): void;
        (event: "close"): void;
    }>();

    const { addNotification } = useNotification();

    const email = ref("");
    const password = ref("");

    const emailIsValid = ref(false);
    const passwordIsValid = ref(false);

    const emailError = ref("");
    const passwordError = ref("");

    // Password handling

    const isPasswordDisplayed = ref(false);

    const hasBeenFocus = ref(false);
    const hasBeenBlur = ref(false);

    function focusPassword() {
        hasBeenFocus.value = true;
        passwordError.value = "";
    }

    //---
    // Submit

    const submitIsLoading = ref(false);

    async function submit() {
        if (submitIsLoading.value) return;

        if (emailIsValid.value && password.value.length > 0) {
            try {
                submitIsLoading.value = true;

                await $fetch("/api/loginSendCodeHandler", {
                    method: "POST",
                    body: {
                        email: email.value,
                        password: password.value,
                    },
                });

                emit("submit", { email: email.value, type: "login" });
            } catch (error) {
                submitIsLoading.value = false;

                if (error instanceof FetchError) {
                    const err: {
                        ok: boolean;
                        message: string;
                    } = error.data;

                    addNotification({
                        title: "An error occured",
                        type: "error",
                        message: err.message,
                    });

                    return;
                }

                addNotification({
                    title: "An error occured",
                    type: "error",
                    message: "An error occured while attempting to log you in. Please, try again later",
                });

                emit("close");
            }

            return;
        }

        if (password.value.length === 0) {
            passwordIsValid.value = false;
            passwordError.value = "This field must contain a valid password";
        }

        checkField(email.value, emailError, "email");

        return;
    }

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
            passwordIsValid.value = true;
        } catch (error) {
            passwordIsValid.value = false;
        }
    });
</script>

<template>
    <div
        class="popup-container"
        @click="$emit('close')"
    >
        <div
            class="popup"
            @click.stop
        >
            <div class="header-container">
                <div class="header">
                    <span class="font04 silk01">Sign in</span>

                    <button
                        type="button"
                        @click="$emit('close')"
                    >
                        <img
                            src="/images/xmark.svg"
                            alt="Xmark icon"
                        />
                    </button>
                </div>

                <span class="font02 micro02">
                    Don’t have an account yet ?
                    <span
                        class="login"
                        @click="$emit('openRegister')"
                        >Create one here</span
                    >
                </span>
            </div>

            <form @submit.prevent="submit()">
                <div class="group">
                    <div class="container">
                        <div class="input-container">
                            <label
                                class="font06 silk02"
                                for="email"
                            >
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
                                <img
                                    v-if="emailIsValid"
                                    src="/images/check.svg"
                                    alt="Check icon"
                                />
                                <img
                                    v-if="emailError"
                                    src="/images/xmark-red.svg"
                                    alt="Xmark icon"
                                />
                            </div>
                        </div>

                        <span class="font05">{{ emailError }}</span>
                    </div>

                    <div class="password-container">
                        <div class="container">
                            <div class="input-container">
                                <div class="input-header">
                                    <label
                                        class="font06 silk02"
                                        for="password"
                                    >
                                        <span>*</span> Password
                                    </label>

                                    <button
                                        type="button"
                                        @click="isPasswordDisplayed = !isPasswordDisplayed"
                                    >
                                        <img
                                            v-if="!isPasswordDisplayed"
                                            src="/images/eye.svg"
                                            alt="Eye icon"
                                        />
                                        <img
                                            v-else
                                            src="/images/eye-close.svg"
                                            alt="Closed eye icon"
                                        />
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
                                    <img
                                        v-if="passwordError"
                                        src="/images/xmark-red.svg"
                                        alt="Xmark icon"
                                    />
                                </div>
                            </div>

                            <span class="font05">{{ passwordError }}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <button
                        class="cancel"
                        type="button"
                    >
                        <span class="font02 micro02">Cancel</span>
                    </button>

                    <button
                        :class="['submit', submitIsLoading ? 'loading' : '']"
                        type="submit"
                    >
                        <svg
                            v-if="submitIsLoading"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                class="dot01"
                                d="M6 10H2V14H6V10Z"
                                fill="#8F8C8F"
                            />
                            <path
                                class="dot02"
                                d="M14 10H10V14H14V10Z"
                                fill="#8F8C8F"
                            />
                            <path
                                class="dot03"
                                d="M22 10H18V14H22V10Z"
                                fill="#8F8C8F"
                            />
                        </svg>
                        <img
                            v-else
                            src="/images/door-open-arrow-in-green.svg"
                            alt="Door open icon"
                        />
                        <span class="font02 micro02">Log in</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/accountSignInPopup.scss";
</style>
