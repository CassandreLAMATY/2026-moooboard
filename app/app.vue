<script setup lang="ts">
    const isLoading = ref(true);

    onMounted(() => {
        isLoading.value = false;
    });
</script>

<template>
    <div class="page-container theme01">
        <NuxtPage />

        <Loader v-if="isLoading" />
    </div>
</template>
