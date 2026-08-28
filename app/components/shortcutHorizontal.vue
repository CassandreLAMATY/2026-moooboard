<script setup lang="ts">
const emit = defineEmits<{
    (event: "delete", payload: number): void;
}>();

const props = defineProps<{
    id: number;
    link: string;
    title: string;
    icon: string;
    iconAlt: string;
    color: string;
}>();
</script>

<template>
    <div class="shortcut-container">
        <a :href="link" class="shortcut-link">
            <div class="shortcut" :style="`background-color: ${color}`">
                <img :src="icon" :alt="iconAlt" />
            </div>

            <span class="font03 micro03">{{ title }}</span>
        </a>

        <button type="button" class="shortcut-delete" @click="$emit('delete', props.id)">
            <img src="/images/stop-circle-full.svg" alt="Delete icon" />
        </button>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcutHorizontal.scss";
</style>
