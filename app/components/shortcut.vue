<script setup lang="ts">
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
        <a class="shortcut-link" :href="props.link">
            <div class="shortcut" :style="`background-color: ${props.color}`">
                <img :src="`/images/${props.icon}`" :alt="props.iconAlt" />
            </div>

            <span class="font03 micro03">{{ props.title }}</span>
        </a>
        <button
            type="button"
            class="shortcut-delete"
            @click="
                $emit('delete', {
                    id: props.id,
                    link: props.link,
                    title: props.title,
                    icon: props.icon,
                    iconAlt: props.iconAlt,
                    color: props.color,
                })
            "
        >
            <img class="" src="/images/stop-circle-full.svg" alt="Delete icon" />
        </button>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcut.scss";
</style>
