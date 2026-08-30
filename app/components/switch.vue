<script setup lang="ts">
const props = defineProps<{
    name: string;
}>();

const isChecked = ref(false);
</script>

<template>
    <div class="switch-container">
        <svg
            version="1.1"
            width="40"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            shape-rendering="crispEdges"
            :class="isChecked ? 'active' : ''"
        >
            <rect x="8" y="0" width="24" height="2" class="outline" />
            <rect x="4" y="2" width="4" height="2" class="outline" />
            <rect x="32" y="2" width="4" height="2" class="outline" />
            <rect x="2" y="4" width="2" height="4" class="outline" />
            <rect x="36" y="4" width="2" height="4" class="outline" />
            <rect x="0" y="8" width="2" height="8" class="outline" />
            <rect x="38" y="8" width="2" height="8" class="outline" />
            <rect x="2" y="16" width="2" height="4" class="outline" />
            <rect x="36" y="16" width="2" height="4" class="outline" />
            <rect x="4" y="20" width="4" height="2" class="outline" />
            <rect x="32" y="20" width="4" height="2" class="outline" />
            <rect x="8" y="22" width="24" height="2" class="outline" />

            <rect x="8" y="2" width="24" height="20" class="background" />
            <rect x="4" y="4" width="4" height="16" class="background" />
            <rect x="32" y="4" width="4" height="16" class="background" />
            <rect x="2" y="8" width="2" height="8" class="background" />
            <rect x="36" y="8" width="2" height="8" class="background" />

            <rect x="10" y="4" width="4" height="16" class="ball" />
            <rect x="6" y="6" width="4" height="12" class="ball" />
            <rect x="14" y="6" width="4" height="12" class="ball" />
            <rect x="4" y="10" width="2" height="4" class="ball" />
            <rect x="18" y="10" width="2" height="4" class="ball" />
        </svg>
        <input type="checkbox" :name="name" :id="name" v-model="isChecked" @click="$emit('clicked', isChecked)" />
    </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/switch.scss";
</style>
