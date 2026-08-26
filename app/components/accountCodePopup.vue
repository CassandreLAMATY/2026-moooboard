<script setup lang="ts">
import { FetchError } from "ofetch";
import type { Notification } from "~/types/notification";

const props = defineProps<{
    type: "registration" | "login";
    email: string;
}>();

const emit = defineEmits<{
    (event: "notify", payload: Notification): void;
    (event: "submit"): void;
    (event: "close"): void;
}>();

//---
// Code

const inputs = ref<HTMLInputElement[]>([]);
const code = ref(["", "", "", "", "", ""]);
const isCodeError = ref(false);

function handleInput(index: number) {
    isCodeError.value = false;
    code.value[index] = code.value[index]!.replace(/\D/g, "").slice(-1);

    if (code.value[index] && index < code.value.length - 1) {
        inputs.value[index + 1]?.focus();
    }

    checkIsSubmitAllowed();
}

function handleBackspace(index: number, event: KeyboardEvent) {
    if (event.key !== "Backspace" || index === 0) return;

    isCodeError.value = false;

    const input = event.currentTarget as HTMLInputElement;
    const isCursorAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

    if (!code.value[index] || isCursorAtStart) {
        event.preventDefault();
        code.value[index - 1] = "";
        inputs.value[index - 1]?.focus();
    }

    checkIsSubmitAllowed();
}

function handlePaste(event: ClipboardEvent) {
    event.preventDefault();

    isCodeError.value = false;

    const pastedCode = event.clipboardData?.getData("text").replace(/\D/g, "").slice(0, 6);

    if (!pastedCode) return;

    pastedCode.split("").forEach((digit, index) => {
        code.value[index] = digit;
    });

    inputs.value[Math.min(pastedCode.length, 6) - 1]?.focus();

    checkIsSubmitAllowed();
}

//---
// Timer

const defaultTimer = [2, 0];
const timer = ref([2, 0]);
const timerIsDisplayed = ref(true);

function handleTimer() {
    timer.value = [...defaultTimer];
    timerIsDisplayed.value = true;

    const interval = setInterval(() => {
        if (timer.value[0] === 0 && timer.value[1] === 0) {
            timerIsDisplayed.value = false;
            clearInterval(interval);
            return;
        }

        if (timer.value[1] === 0) {
            timer.value[0]! -= 1;
            timer.value[1] = 59;
            return;
        }

        timer.value[1]! -= 1;
    }, 1000);

    onUnmounted(() => clearInterval(interval));
}

async function resendCode() {
    if (timerIsDisplayed.value) return;

    handleTimer();

    try {
        await $fetch("/api/registerResendCodeHandler", {
            method: "POST",
        });

        emit("notify", {
            title: "Code successfully resent",
            type: "success",
            message: "Registration code was successfully sent to the provided email address.",
        });
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
            message: "An error occured while attempting to verify your account. Please, try again later.",
        });
        emit("close");
    }
}

//---
// Submit

const submitIsLoading = ref(false);
const submitIsAllowed = ref(false);

function checkIsSubmitAllowed(): string | undefined {
    const completeCode = code.value.join("");

    if (completeCode.length === 6) {
        submitIsAllowed.value = true;
        return completeCode;
    }

    submitIsAllowed.value = false;

    return;
}

async function submit() {
    const code = checkIsSubmitAllowed();

    if (submitIsLoading.value || !code) return;

    try {
        if (props.type === "registration") {
            await $fetch("/api/registerVerificationHandler", {
                method: "POST",
                body: {
                    code: code,
                },
            });
        }

        if (props.type === "login") {
            await $fetch("/api/loginVerificationHandler", {
                method: "POST",
                body: {
                    code: code,
                },
            });
        }

        emit("submit");
        emit("close");
    } catch (error) {
        if (error instanceof FetchError) {
            const err: {
                ok: boolean;
                message: string;
                code: string | undefined;
            } = error.data;

            if ((err.code && err.code === "E07020") || (err.code && err.code === "E08020")) {
                isCodeError.value = true;

                emit("notify", {
                    title: "Invalid code",
                    type: "error",
                    message: err.message,
                });

                return;
            }

            emit("notify", {
                title: "An error occured",
                type: "error",
                message: err.message,
            });

            return;
        }

        emit("notify", {
            title: "An error occured",
            type: "error",
            message: "An error occured while attempting to verify your account. Please, try again later",
        });
        emit("close");
    }
}

onMounted(() => {
    handleTimer();
});
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop>
            <div class="header-container">
                <div class="header">
                    <span class="font04 silk01">
                        {{ type === "registration" ? "Confirm email address" : "Login confirmation" }}
                    </span>

                    <button type="button" @click="$emit('close')">
                        <img src="/images/xmark.svg" alt="Xmark icon" />
                    </button>
                </div>

                <span class="font02 micro02">
                    You received a code at <span class="underline">{{ email }}</span> ; it will be valid for 10 minutes.
                    If you can’t find it, check your spam folder !
                </span>
            </div>

            <form @submit.prevent="submit()">
                <div class="code-group">
                    <div class="code-container" @paste="handlePaste">
                        <label class="font06 silk02"> Code <span>(6 digits)</span> </label>

                        <div class="input-container">
                            <input
                                v-for="(_, i) in code"
                                ref="inputs"
                                type="text"
                                inputmode="numeric"
                                v-model="code[i]"
                                maxlength="1"
                                :class="['font09', 'micro09', isCodeError ? 'err' : '']"
                                @input="handleInput(i)"
                                @keydown="handleBackspace(i, $event)"
                            />
                        </div>
                    </div>

                    <div class="btn-container">
                        <button :class="!timerIsDisplayed ? 'active' : ''" type="button" @click="resendCode()">
                            <span class="font03 micro03">Resend code</span>
                        </button>
                        <span class="timer font03 micro03" v-if="timerIsDisplayed">
                            0{{ timer[0] }}:{{ timer[1]! <= 9 ? "0" : "" }}{{ timer[1] }}
                        </span>
                    </div>
                </div>

                <div class="footer">
                    <button class="cancel" type="button">
                        <span class="font02 micro02">Cancel</span>
                    </button>

                    <button
                        :class="['submit-code', submitIsLoading ? 'loading' : '', submitIsAllowed ? 'active' : '']"
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
                            <path class="dot01" d="M6 10H2V14H6V10Z" fill="#8F8C8F" />
                            <path class="dot02" d="M14 10H10V14H14V10Z" fill="#8F8C8F" />
                            <path class="dot03" d="M22 10H18V14H22V10Z" fill="#8F8C8F" />
                        </svg>
                        <img
                            v-else-if="submitIsAllowed"
                            src="/images/door-open-arrow-in-green.svg"
                            alt="Door open icon"
                        />
                        <img v-else src="/images/door-open-arrow-in-grayed.svg" alt="Door open icon" />
                        <span class="font02 micro02">{{ type === "registration" ? "Register" : "Log in" }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/accountSignInPopup.scss";
</style>
