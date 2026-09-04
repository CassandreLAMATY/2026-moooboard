<script setup lang="ts">
    const props = defineProps<{
        id: number;
        link: string;
        title: string;
        icon: string;
        iconAlt: string;
        color: string;
    }>();

    const { removeShortcut } = useShortcuts();
</script>

<template>
    <div class="shortcut-container">
        <a
            class="shortcut-link"
            :href="props.link"
        >
            <div
                class="shortcut"
                :style="`background-color: ${props.color}`"
            >
                <img
                    :src="props.icon"
                    :alt="props.iconAlt"
                />
            </div>

            <span class="font03 micro03">{{ props.title }}</span>
        </a>
        <button
            type="button"
            class="shortcut-delete"
            @click="removeShortcut(props.id)"
        >
            <img
                src="/images/stop-circle-full.svg"
                alt="Delete icon"
            />
        </button>
    </div>
</template>

<style scoped lang="scss">
    @use "~/assets/scss/shortcut.scss";
</style>
