<script setup lang="ts">
    defineProps<{
        notificationKey: number;
        title: string;
        type: "info" | "success" | "error";
        message: string;
    }>();

    const emit = defineEmits<{
        (event: "close", payload: number): void;
    }>();
</script>

<template>
    <div :class="['notification', type, 'remove']">
        <div class="header">
            <span class="font04 silk01">{{ title }}</span>

            <button
                type="button"
                @click="$emit('close', notificationKey)"
            >
                <img
                    src="/images/xmark-white-09.svg"
                    alt="Xmark icon"
                />
            </button>
        </div>

        <span class="font02 micro02">{{ message }}</span>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/notification.scss";
</style>
