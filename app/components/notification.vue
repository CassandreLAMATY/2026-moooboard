<script setup lang="ts">
defineProps<{
    key: number;
    title: string;
    type: "info" | "success" | "error";
    message: string;
    isRemove: boolean;
}>();
</script>

<template>
    <div :class="['notification', type, isRemove ? 'remove' : '']">
        <div class="header">
            <span class="font04 silk01">{{ title }}</span>

            <button type="button" @click="$emit('close', key)">
                <img src="/images/xmark-white-09.svg" alt="Xmark icon" />
            </button>
        </div>

        <span class="font02 micro02">{{ message }}</span>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/notification.scss";
</style>
