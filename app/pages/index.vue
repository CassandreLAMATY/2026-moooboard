<script setup lang="ts">
const shortcuts = [
    {
        link: "https://www.twitch.tv/kodurooo",
        title: "Twitch",
        icon: "twitch.svg",
        iconAlt: "Twitch icon",
        color: "#a172f7",
    },
];
</script>

<template>
    <div class="page">
        <Navbar />
        <ShortcutBox :shortcuts="shortcuts" />
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/index.scss";
</style>
