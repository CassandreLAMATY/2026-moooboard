<script setup lang="ts">
const shortcuts: Ref<{ link: string; title: string; icon: string; iconAlt: string; color: string }[]> = ref([]);

onMounted(() => {
    const shortcutsData = localStorage.getItem("moooboard:shortcuts");

    if (shortcutsData) {
        shortcuts.value = JSON.parse(shortcutsData);
    }
});
</script>

<template>
    <div class="page">
        <Navbar />
        <ShortcutBox v-if="shortcuts.length > 0" :shortcuts="shortcuts" />
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/index.scss";
</style>
