<script setup lang="ts">
const props = defineProps<{
    x: number;
    y: number;
}>();
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop :style="`left: ${x}px; top: calc(${y}px + 12px);`">
            <div class="content">
                <button type="button">
                    <img src="/images/gear-white-02-24.svg" alt="Gear icon" />
                    <span class="font02 micro02">Settings</span>
                </button>
                <button type="button" @click="$emit('openLogoutConfirmation')">
                    <img src="/images/door-half-open-light-red-24.svg" alt="Door icon" />
                    <span class="font02 micro02">Log out</span>
                </button>
            </div>

            <div class="separator"></div>

            <div class="footer">
                <span class="font10 micro10">Created with</span>
                <img src="/images/heart-light-red-16.svg" alt="Heart icon" />
                <span class="font10 micro10">by <a href="https://www.kodurooo.com" target="_BLANK">Kodurooo</a></span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/profilePopup.scss";
</style>
