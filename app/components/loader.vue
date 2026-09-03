<script setup lang="ts">
    const isFrame1Displayed = ref(true);
    const iconTimeout: Ref<NodeJS.Timeout | undefined> = ref(undefined);

    onMounted(() => {
        setIconTimeout(iconTimeout, isFrame1Displayed);
    });

    onUnmounted(() => {
        clearTimeout(iconTimeout.value);
    });
</script>

<template>
    <div class="loader-container">
        <img
            v-if="isFrame1Displayed"
            src="/images/pomodoro/cow01.svg"
            alt="Cow icon"
        />
        <img
            v-else
            src="/images/pomodoro/cow02.svg"
            alt="Cow icon"
        />
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/loader.scss";
</style>
