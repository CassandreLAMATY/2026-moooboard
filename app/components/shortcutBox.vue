<script setup lang="ts">
const props = defineProps<{
    shortcuts: { id: number; link: string; title: string; icon: string; iconAlt: string; color: string }[];
}>();

const box: Ref<HTMLElement | null> = ref(null);
const container: Ref<HTMLElement | null> = ref(null);

const boxX = ref(0);
const boxY = ref(0);

const isPopupOpen = ref(false);

const shortcutWidth = 64;
const shortcutGap = 12;

const shortcutsToShow = ref(0);

onMounted(() => {
    nextTick(() => {
        getPopupPosition(box, boxX, boxY);
    });

    if (container.value) {
        shortcutsToShow.value = findShortcutsToShow(container.value.offsetWidth, shortcutWidth, shortcutGap);

        window.addEventListener("resize", () => {
            getPopupPosition(box, boxX, boxY);

            if (container.value) {
                shortcutsToShow.value = findShortcutsToShow(container.value.offsetWidth, shortcutWidth, shortcutGap);
            }
        });
    }
});

onUnmounted(() => {
    if (container.value) {
        window.removeEventListener("resize", () => {
            getPopupPosition(box, boxX, boxY);

            if (container.value) {
                shortcutsToShow.value = findShortcutsToShow(container.value.offsetWidth, shortcutWidth, shortcutGap);
            }
        });
    }
});

watch(props.shortcuts, () => {
    if (container.value) {
        shortcutsToShow.value = findShortcutsToShow(container.value.offsetWidth, shortcutWidth, shortcutGap);
    }
});
</script>

<template>
    <div ref="box" class="shortcut-box">
        <div ref="container" class="container">
            <Shortcut
                v-for="s in props.shortcuts.slice(0, shortcutsToShow)"
                :id="s.id"
                :link="s.link"
                :title="s.title"
                :icon="s.icon"
                :iconAlt="s.iconAlt"
                :color="s.color"
                @delete="(id) => $emit('delete', id)"
            />
        </div>
        <button
            type="button"
            class="btn-round"
            v-if="props.shortcuts.length > shortcutsToShow"
            @click="isPopupOpen = !isPopupOpen"
        >
            <img src="/images/chevron-down-small.svg" alt="Chevron down icon" />
        </button>

        <ShortcutPopup
            v-if="isPopupOpen"
            :shortcuts="props.shortcuts.slice(shortcutsToShow)"
            :x="boxX"
            :y="boxY"
            @close="isPopupOpen = false"
        />
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/shortcutBox.scss";
</style>
