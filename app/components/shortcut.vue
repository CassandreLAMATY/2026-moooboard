<script setup lang="ts">
const props = defineProps<{
    link: string;
    title: string;
    icon: string;
    iconAlt: string;
    color: string;
}>();
</script>

<template>
    <a class="shortcut-link" :href="props.link">
        <div class="shortcut-container">
            <div class="shortcut" :style="`background-color: ${props.color}`">
                <img :src="`/images/${props.icon}`" :alt="props.iconAlt" />
            </div>

            <span class="font03 micro03">{{ props.title }}</span>
        </div>
    </a>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcut.scss";
</style>
