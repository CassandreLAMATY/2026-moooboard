<script setup lang="ts">
    import { FetchError } from "ofetch";
    import { signInEmailSchema } from "~/schemas/signInSchemas";

    const emit = defineEmits<{
        (event: "submit", payload: { email: string; type: "forgotten-password" }): void;
        (event: "openLogin"): void;
        (event: "close"): void;
    }>();

    const { addNotification } = useNotification();

    const email = ref("");

    const emailIsValid = ref(false);

    const emailError = ref("");

    //---
    // Submit

    const submitIsLoading = ref(false);

    async function submit() {
        if (submitIsLoading.value) return;

        if (emailIsValid.value) {
            try {
                submitIsLoading.value = true;

                await $fetch("/api/forgottenPasswordSendCodeHandler", {
                    method: "POST",
                    body: {
                        email: email.value,
                    },
                });

                emit("submit", { email: email.value, type: "forgotten-password" });
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
                    <span class="font04 silk01">Forgotten password</span>

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
                    Don’t worry, we’re here to help, we’ll send you a code by email to confirm your identity first.
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
                </div>

                <div class="footer">
                    <button
                        class="cancel"
                        type="button"
                        @click="$emit('openLogin')"
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
                            src="/images/check-light-green-24.svg"
                            alt="Door open icon"
                        />
                        <span class="font02 micro02">Next</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/accountSignInPopup.scss";
</style>
