<script setup lang="ts">
const emit = defineEmits<{
    (event: "delete", payload: number): void;
    (event: "close"): void;
}>();

const props = defineProps<{
    shortcuts: { id: number; link: string; title: string; icon: string; iconAlt: string; color: string }[];
    x: number;
    y: number;
}>();
</script>

<template>
    <div class="popup-container" @click="$emit('close')">
        <div class="popup" @click.stop :style="`left: ${x}px; top: calc(${y}px + 12px);`">
            <div class="shortcuts-container">
                <ShortcutHorizontal
                    v-for="s in props.shortcuts"
                    :id="s.id"
                    :link="s.link"
                    :title="s.title"
                    :icon="s.icon"
                    :iconAlt="s.iconAlt"
                    :color="s.color"
                    @delete="(id) => $emit('delete', id)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcutPopup.scss";
</style>
