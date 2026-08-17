<script setup lang="ts">
import type { Shortcut } from "~/types/shortcut";

const props = defineProps<{
    shortcuts: { id: number; link: string; title: string; icon: string; iconAlt: string; color: string }[];
}>();

const shortcutWidth = 64;
const shortcutGap = 12;

const shortcutsToShow = ref(0);

onMounted(() => {
    const container = document.getElementById("shortcuts-container");

    if (container) {
        shortcutsToShow.value = findShortcutsToShow(container.offsetWidth, shortcutWidth, shortcutGap);

        window.addEventListener("resize", () => {
            shortcutsToShow.value = findShortcutsToShow(container.offsetWidth, shortcutWidth, shortcutGap);
        });
    }
});

onUnmounted(() => {
    const container = document.getElementById("shortcuts-container");

    if (container) {
        shortcutsToShow.value = findShortcutsToShow(container.offsetWidth, shortcutWidth, shortcutGap);

        window.removeEventListener("resize", () => {
            shortcutsToShow.value = findShortcutsToShow(container.offsetWidth, shortcutWidth, shortcutGap);
        });
    }
});
</script>

<template>
    <div class="shortcut-box">
        <div class="container" id="shortcuts-container">
            <Shortcut
                v-for="s in props.shortcuts.slice(0, shortcutsToShow)"
                :id="s.id"
                :link="s.link"
                :title="s.title"
                :icon="s.icon"
                :iconAlt="s.iconAlt"
                :color="s.color"
                @delete="(e: Shortcut) => $emit('delete', e)"
            />
        </div>
        <button type="button" class="btn-round" v-if="props.shortcuts.length > shortcutsToShow">
            <img src="/images/chevron-down-small.svg" alt="Chevron down icon" />
        </button>
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcutBox.scss";
</style>
