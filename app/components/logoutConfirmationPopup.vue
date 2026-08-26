<script setup lang="ts">
import { FetchError } from "ofetch";
import type { Notification } from "~/types/notification";

const emit = defineEmits<{
    (event: "notify", payload: Notification): void;
    (event: "submit"): void;
    (event: "close"): void;
}>();

const submitIsLoading = ref(false);

async function submit() {
    if (submitIsLoading.value) return;

    try {
        submitIsLoading.value = true;

        await $fetch("/api/logoutHandler", {
            method: "POST",
        });

        emit("submit");
    } catch (error) {
        submitIsLoading.value = false;

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

            return;
        }

        emit("notify", {
            title: "An error occured",
            type: "error",
            message: "An error occured while attempting to revoke your session",
        });
        emit("close");
    }
}
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop>
            <div class="header-container">
                <div class="header">
                    <span class="font04 silk01">Log out confirmation</span>

                    <button type="button" @click="$emit('close')">
                        <img src="/images/xmark.svg" alt="Xmark icon" />
                    </button>
                </div>

                <span class="font02 micro02"> Are you sure you want to <span class="red">Log Out</span> ? </span>
            </div>

            <div class="footer">
                <button class="cancel" type="button" @click="$emit('close')">
                    <span class="font02 micro02">Cancel</span>
                </button>

                <button :class="['submit', submitIsLoading ? 'loading' : '']" type="button" @click="submit()">
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
                    <img v-else src="/images/door-open-arrow-in-light-red-24.svg" alt="Door open icon" />
                    <span class="font02 micro02">Yes, log me out</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/confirmationPopup.scss";
</style>
